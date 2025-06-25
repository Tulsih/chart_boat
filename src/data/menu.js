// data/menu.js - Menu data service
const foodMenu = [
  { id: 1, name: "Margherita Pizza", price: 199, category: "Pizza" },
  { id: 2, name: "Chicken Burger", price: 169, category: "Burger" },
  { id: 3, name: "Caesar Salad", price: 100, category: "Salad" },
  { id: 4, name: "Pasta Carbonara", price: 199, category: "Pasta" },
  { id: 5, name: "Fish & Chips", price: 179, category: "Seafood" },
  { id: 6, name: "Chicken Wings", price: 159, category: "Appetizer" },
  { id: 7, name: "Beef Tacos", price: 99, category: "Mexican" },
  { id: 8, name: "Veggie Wrap", price: 99, category: "Healthy" },
  { id: 9, name: "BBQ Ribs", price: 189, category: "BBQ" },
  { id: 10, name: "Chocolate Cake", price: 109, category: "Dessert" },
  { id: 11, name: "Garlic Bread", price: 99, category: "Sides" },
  { id: 12, name: "Ice Cream Sundae", price: 89, category: "Dessert" },
];

class MenuService {
  static getAllItems() {
    return foodMenu;
  }

  static getItemById(id) {
    return foodMenu.find((item) => item.id === parseInt(id));
  }

  static getItemsByIds(ids) {
    return foodMenu.filter((item) => ids.includes(item.id));
  }

  static getMenuButtons() {
    return foodMenu.map((item) => ({
      text: `${item.name} - ₹${item.price}`,
      value: item.id,
      price: item.price,
      name: item.name,
    }));
  }

  static getItemsByCategory(category) {
    return foodMenu.filter((item) => item.category === category);
  }
}

module.exports = { MenuService, foodMenu };
