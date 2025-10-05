package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Coupon struct {
	Code        string    `json:"code"`
	Discount    float64   `json:"discount"`
	MinPurchase float64   `json:"min_purchase"`
	ExpiresAt   time.Time `json:"expires_at"`
	Used        bool      `json:"used"`
}

var coupons = []Coupon{
	{Code: "SAVE20", Discount: 20, MinPurchase: 100, ExpiresAt: time.Now().AddDate(0, 1, 0), Used: false},
	{Code: "FIRST10", Discount: 10, MinPurchase: 0, ExpiresAt: time.Now().AddDate(0, 0, 7), Used: false},
	{Code: "EXPIRED", Discount: 50, MinPurchase: 50, ExpiresAt: time.Now().AddDate(0, 0, -5), Used: false},
}

func jsonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func getCoupons(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(coupons)
}

func applyCoupon(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Code     string  `json:"code"`
		Purchase float64 `json:"purchase"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	for i := range coupons {
		if coupons[i].Code == req.Code {
			if coupons[i].Used {
				http.Error(w, "Coupon already used", http.StatusBadRequest)
				return
			}

			if time.Now().After(coupons[i].ExpiresAt) {
				http.Error(w, "Coupon expired", http.StatusBadRequest)
				return
			}

			if req.Purchase < coupons[i].MinPurchase {
				http.Error(w, "Purchase below minimum", http.StatusBadRequest)
				return
			}

			coupons[i].Used = true
			finalPrice := req.Purchase - (req.Purchase * coupons[i].Discount / 100)

			response := map[string]interface{}{
				"original_price": req.Purchase,
				"discount":       coupons[i].Discount,
				"final_price":    finalPrice,
			}

			log.Printf("Applied coupon %s: $%.2f -> $%.2f", req.Code, req.Purchase, finalPrice)
			json.NewEncoder(w).Encode(response)
			return
		}
	}

	http.Error(w, "Coupon not found", http.StatusNotFound)
}

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(jsonMiddleware)

	r.Get("/coupons", getCoupons)
	r.Post("/coupons/apply", applyCoupon)

	log.Println("Coupon API running on http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", r))
}
