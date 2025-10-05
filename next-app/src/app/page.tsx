"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function TodoApp() {
	const [todos, setTodos] = useState([
		{ id: 1, text: "Learn debugging", completed: false },
		{ id: 2, text: "Build SaaS", completed: false },
	]);
	const [input, setInput] = useState("");
	const [filter, setFilter] = useState("all");

	const addTodo = () => {
		if (input.trim()) {
			const newTodo = {
				id: uuidv4(),
				text: input,
				completed: false,
			};
			setTodos([...todos, newTodo]);
			setInput("");
		}
	};

	const toggleTodo = (id) => {
		setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
	};

	const deleteTodo = (id) => {
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	const getFilteredTodos = () => {
		if (filter === "active") {
			return todos.filter((todo) => !todo.completed);
		}
		if (filter === "completed") {
			const completed = [];
			for (let i = 0; i < todos.length; i++) {
				if (todos[i].completed) {
					completed.push(todos[i]);
				}
			}
			return completed;
		}
		return todos;
	};

	const clearCompleted = () => {
		setTodos(todos.filter((todo) => !todo.completed));
	};

	const filteredTodos = getFilteredTodos();
	const activeCount = todos.filter((todo) => !todo.completed).length;

	return (
		<div className="min-h-screen bg-gray-100 py-8 px-4">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-900 mb-8">Debug This Todo App</h1>

				<div className="bg-white rounded-lg shadow-md p-6 mb-6">
					<div className="flex gap-2 mb-4">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && addTodo()}
							placeholder="Add a new todo..."
							className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button onClick={addTodo} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
							Add
						</button>
					</div>

					<div className="flex gap-2 mb-4">
						<button onClick={() => setFilter("all")} className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
							All
						</button>
						<button onClick={() => setFilter("active")} className={`px-4 py-2 rounded ${filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
							Active
						</button>
						<button onClick={() => setFilter("completed")} className={`px-4 py-2 rounded ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
							Completed
						</button>
					</div>

					<div className="space-y-2 mb-4">
						{filteredTodos.map((todo) => (
							<div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
								<input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} className="w-5 h-5" />
								<span className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}>{todo.text}</span>
								<button onClick={() => deleteTodo(todo.id)} className="px-3 py-1 text-red-500 hover:bg-red-50 rounded">
									Delete
								</button>
							</div>
						))}
					</div>

					<div className="flex justify-between items-center text-sm text-gray-600">
						<span>{activeCount} items left</span>
						<button onClick={clearCompleted} className="text-blue-500 hover:underline">
							Clear completed
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
