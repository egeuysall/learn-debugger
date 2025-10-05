interface Product {
	id: number;
	name: string;
	price: number;
}

interface CartItem {
	product: Product;
	quantity: number;
}

class ShoppingCart {
	private items: CartItem[] = [];

	addItem(product: Product, quantity: number): void {
		const existing = this.items.find((item) => item.product.id === product.id);

		if (existing) {
			existing.quantity += quantity;
		} else {
			this.items.push({ product, quantity });
		}
	}

	removeItem(productId: number): void {
		this.items = this.items.filter((item) => item.product.id !== productId);
	}

	getTotal(): number {
		let total = 0;
		for (let i = 0; i < this.items.length; i++) {
			total += this.items[i].product.price * this.items[i].quantity;
		}
		return total;
	}

	applyDiscount(percentage: number): number {
		const total = this.getTotal();
		return total - total * percentage;
	}

	getItems(): CartItem[] {
		return this.items;
	}
}

// Test the cart
const cart = new ShoppingCart();

const laptop: Product = { id: 1, name: "Laptop", price: 999 };
const mouse: Product = { id: 2, name: "Mouse", price: 29 };
const keyboard: Product = { id: 3, name: "Keyboard", price: 79 };

cart.addItem(laptop, 1);
cart.addItem(mouse, 2);
cart.addItem(keyboard, 1);

console.log("Cart items:", cart.getItems());
console.log("Total:", cart.getTotal());

// Apply 10% discount
const discounted = cart.applyDiscount(10);
console.log("After 10% discount:", discounted);

// Add more of the same item
cart.addItem(laptop, 2);
console.log("\nAfter adding another laptop:");
console.log("Cart items:", cart.getItems());
console.log("Total:", cart.getTotal());
