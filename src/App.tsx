import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { 
  Calculator, 
  Printer, 
  Plus, 
  Trash2, 
  AlertCircle,
  ClipboardList,
  Utensils,
  CheckSquare,
  BookOpen,
  X,
  Package,
  Download,
  Upload,
  Save
} from 'lucide-react';

// --- INITIAL MASTER DATA ---
const INITIAL_SCHOOLS = [
  { id: 'A3', code: 'A3', name: 'Sloan Lake' },
  { id: 'A4', code: 'A4', name: 'Midtown' },
  { id: 'A5', code: 'A5', name: 'Berkeley Park' },
  { id: 'A6', code: 'A6', name: 'Goddard Westminster' },
  { id: 'A8', code: 'A8', name: 'Kids 4 Real' },
  { id: 'A9', code: 'A9', name: 'My First Steps' },
  { id: 'A10', code: 'A10', name: 'Step Up' },
  { id: 'B2', code: 'B2', name: 'Happy Ladybug' },
  { id: 'C1', code: 'C1', name: 'Cannon LC' },
  { id: 'C3', code: 'C3', name: 'Echinacea' },
  { id: 'D2', code: 'D2', name: 'Little School' },
  { id: 'D3', code: 'D3', name: 'Goddard Castle Rock' },
];

const CATEGORIES = ['Protein/Main', 'Vegetable', 'Fruit', 'Grain', 'Misc/Snack'];

const INITIAL_FOOD_CATALOG = [
  // --- FRUIT ---
  { id: 'fr1', name: 'Apple Slices', category: 'Fruit', maxPerContainer: 5.0, s_1_16: '', s_1_8: '', s_1_4: '0.11', s_1_2: '0.22', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr2', name: 'Fresh Apple Slice', category: 'Fruit', maxPerContainer: 5.0, s_1_16: '', s_1_8: '', s_1_4: '0.11', s_1_2: '0.22', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr3', name: 'Cinnamon Apple Slices', category: 'Fruit', maxPerContainer: 4.0, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr4', name: 'Cantaloupe', category: 'Fruit', maxPerContainer: 4.0, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr5', name: 'Honeydew', category: 'Fruit', maxPerContainer: 4.0, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr6', name: 'Fruit Salad', category: 'Fruit', maxPerContainer: 5.0, s_1_16: '', s_1_8: '', s_1_4: '0.11', s_1_2: '0.22', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr7', name: 'Fruit Cocktail', category: 'Fruit', maxPerContainer: 4.0, s_1_16: '', s_1_8: '', s_1_4: '0.12', s_1_2: '0.24', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr8', name: 'Mango', category: 'Fruit', maxPerContainer: 4.0, s_1_16: '', s_1_8: '', s_1_4: '0.12', s_1_2: '0.24', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr9', name: 'Oranges', category: 'Fruit', maxPerContainer: 5.0, s_1_16: '', s_1_8: '', s_1_4: '0.11', s_1_2: '0.22', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr10', name: 'Peaches', category: 'Fruit', maxPerContainer: 5.0, s_1_16: '', s_1_8: '', s_1_4: '0.11', s_1_2: '0.22', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr11', name: 'Pears', category: 'Fruit', maxPerContainer: 5.0, s_1_16: '', s_1_8: '', s_1_4: '0.11', s_1_2: '0.22', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr12', name: 'Pineapple', category: 'Fruit', maxPerContainer: 5.0, s_1_16: '', s_1_8: '', s_1_4: '0.11', s_1_2: '0.22', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr13', name: 'Blueberries', category: 'Fruit', maxPerContainer: 4.0, s_1_16: '', s_1_8: '', s_1_4: '0.12', s_1_2: '0.24', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr14', name: 'Banana', category: 'Fruit', maxPerContainer: 5.0, s_1_16: '', s_1_8: '', s_1_4: '0.14', s_1_2: '0.28', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr15', name: 'Apple Sauce', category: 'Fruit', maxPerContainer: 5.0, s_1_16: '', s_1_8: '', s_1_4: '0.12', s_1_2: '0.24', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'fr16', name: 'Manderins', category: 'Fruit', maxPerContainer: 5.0, s_1_16: '', s_1_8: '', s_1_4: '0.12', s_1_2: '0.24', s_3_4: '', ea_label: '', ea_value: null },

  // --- VEGETABLE ---
  { id: 'vg1', name: 'Broccoli', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg2', name: 'Cauliflower', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg3', name: 'Normandy Blend', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg4', name: 'Carrots', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg5', name: 'Peas n Carrot', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg6', name: 'Peas', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg7', name: 'Corn', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg8', name: 'Mix Veggies', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg9', name: 'Green Beans', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg10', name: 'Mash Potato', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.14', s_1_2: '0.28', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg11', name: 'Oregon Mix Veggies', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg12', name: 'Pinto Beans', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '0.06', s_1_4: '0.12', s_1_2: '0.24', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg13', name: 'Black Beans', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '0.06', s_1_4: '0.12', s_1_2: '0.24', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg14', name: 'Red Beans', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '0.06', s_1_4: '0.12', s_1_2: '0.24', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'vg15', name: 'Refried Beans', category: 'Vegetable', maxPerContainer: 2.5, s_1_16: '', s_1_8: '0.07', s_1_4: '0.14', s_1_2: '0.28', s_3_4: '', ea_label: '', ea_value: null },

  // --- GRAIN ---
  { id: 'gr1', name: 'Corn Flakes', category: 'Grain', maxPerContainer: 2.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '0.06', ea_label: '', ea_value: null },
  { id: 'gr2', name: 'WG Corn Chex', category: 'Grain', maxPerContainer: 2.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '0.06', ea_label: '', ea_value: null },
  { id: 'gr3', name: 'WG Rice Chex', category: 'Grain', maxPerContainer: 2.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '0.06', ea_label: '', ea_value: null },
  { id: 'gr4', name: 'WG Cheerios', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr5', name: 'WG Waffles', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr6', name: 'Wg French Toast', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr7', name: 'Wg Pancakes', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr8', name: 'Wg Pancakes Bites', category: 'Grain', maxPerContainer: 100.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '3 Ea', ea_value: 3 },
  { id: 'gr9', name: 'Wg Bread Slice', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr10', name: 'Wg Cinnamon Raising Bread', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr11', name: 'Biscuit', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr12', name: 'English Muffins', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr13', name: 'Oat Meals', category: 'Grain', maxPerContainer: 2.0, s_1_16: '', s_1_8: '0.08', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'gr14', name: 'Ritz', category: 'Grain', maxPerContainer: 150.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '5 Ea', ea_value: 5 },
  { id: 'gr15', name: 'Pretzels Bites', category: 'Grain', maxPerContainer: 100.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '3 Ea', ea_value: 3 },
  { id: 'gr16', name: 'WG sweet Potato Crackers', category: 'Grain', maxPerContainer: 2.0, s_1_16: '', s_1_8: '0.06', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'gr17', name: 'Animal Crackers', category: 'Grain', maxPerContainer: 2.0, s_1_16: '', s_1_8: '0.06', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'gr18', name: 'Saltine Crackers', category: 'Grain', maxPerContainer: 150.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '5 Ea', ea_value: 5 },
  { id: 'gr19', name: 'Graham Crackers', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr20', name: 'Pitta', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1/4 Ea', ea_value: 0.25 },
  { id: 'gr21', name: 'Bagel', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr22', name: 'WG Bun', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr23', name: 'WG Sub', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr24', name: 'WG Tortilla', category: 'Grain', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'gr25', name: 'Wg Brown Rice', category: 'Grain', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'gr26', name: 'Wg Penne Pasta', category: 'Grain', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'gr27', name: 'Wg Elbow Pasta', category: 'Grain', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'gr28', name: 'Wg Quinoa', category: 'Grain', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'gr29', name: 'Wg Rotini Pasta', category: 'Grain', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'gr30', name: 'Wg Spaghetti Pasta', category: 'Grain', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'gr31', name: 'Granola', category: 'Grain', maxPerContainer: 2.5, s_1_16: '', s_1_8: '0.04', s_1_4: '0.08', s_1_2: '0.16', s_3_4: '', ea_label: '', ea_value: null },

  // --- PROTEIN / MAIN ---
  { id: 'pr1', name: 'Diced Turkey', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr2', name: 'Ground Beef', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr3', name: 'Ground Turkey', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr4', name: 'Chicken', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.10', s_1_2: '0.20', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr5', name: 'Beef (Tacos)', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.14', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr6', name: 'Chicken Teriyaki', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.14', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr7', name: 'Mac and Cheese', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.15', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr8', name: 'Ground Turkey BBQ', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.14', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr9', name: 'Ground Beef Picadillo', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '0.30', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr10', name: 'Chili Beef and Bean', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '0.30', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr11', name: 'Chili Bean (vegetarian)', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '0.30', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr12', name: 'Broccoli Pesto W Pasta', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.18', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr13', name: 'Roasted Bell Pepper W Pasta', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.18', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr14', name: 'Alfredo Sauce W Pasta', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.18', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr15', name: 'Beef Sloppy Joe', category: 'Protein/Main', maxPerContainer: 2.5, s_1_16: '', s_1_8: '', s_1_4: '0.14', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr16', name: 'Chicken Salad', category: 'Protein/Main', maxPerContainer: 4.5, s_1_16: '', s_1_8: '', s_1_4: '0.12', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'pr17', name: 'Meatballs', category: 'Protein/Main', maxPerContainer: 100.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '4 Ea', ea_value: 4 },
  { id: 'pr18', name: 'Chicken Nuggets', category: 'Protein/Main', maxPerContainer: 70.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '5 Ea', ea_value: 5 },
  { id: 'pr19', name: 'Turkey Sausage', category: 'Protein/Main', maxPerContainer: 40.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '2 Ea', ea_value: 2 },
  { id: 'pr20', name: 'Turkey Slice', category: 'Protein/Main', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  
  // --- MISC / SNACK / DAIRY ---
  { id: 'ms1', name: 'Cheese Slice', category: 'Misc/Snack', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'ms2', name: 'Shredded Cheese', category: 'Misc/Snack', maxPerContainer: 5.0, s_1_16: '0.02', s_1_8: '0.04', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'ms3', name: 'Cottage Cheese', category: 'Misc/Snack', maxPerContainer: 3.5, s_1_16: '', s_1_8: '0.08', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'ms4', name: 'String Cheese', category: 'Misc/Snack', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'ms5', name: 'Cheese Cubes', category: 'Misc/Snack', maxPerContainer: 150.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '3 Ea', ea_value: 3 },
  { id: 'ms6', name: 'Yogurt', category: 'Misc/Snack', maxPerContainer: 3.0, s_1_16: '', s_1_8: '', s_1_4: '0.14', s_1_2: '0.28', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'ms7', name: 'Hummus (Snack)', category: 'Misc/Snack', maxPerContainer: 4.0, s_1_16: '', s_1_8: '0.07', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'ms8', name: 'Hard boiled Egg', category: 'Misc/Snack', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'ms9', name: 'Egg Pattie', category: 'Misc/Snack', maxPerContainer: 50.0, s_1_16: '', s_1_8: '', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '1 Ea', ea_value: 1 },
  { id: 'ms10', name: 'Bean DIP', category: 'Misc/Snack', maxPerContainer: 4.0, s_1_16: '', s_1_8: '', s_1_4: '0.14', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
  { id: 'ms11', name: 'Sunbutter Natural', category: 'Misc/Snack', maxPerContainer: 5.0, s_1_16: '', s_1_8: '0.08', s_1_4: '', s_1_2: '', s_3_4: '', ea_label: '', ea_value: null },
];

const INITIAL_TEMPLATES = [
  {
    id: 't1',
    name: 'Sample Week Menu',
    days: {
      Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: []
    }
  }
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const getAvailableOptions = (food: any) => {
  const opts = [];
  if (food.s_1_16) opts.push({ key: `${food.id}|s_1_16`, food, sizeLabel: '1/16 cup', sizeValue: parseFloat(food.s_1_16), type: 'LBS' });
  if (food.s_1_8) opts.push({ key: `${food.id}|s_1_8`, food, sizeLabel: '1/8 cup', sizeValue: parseFloat(food.s_1_8), type: 'LBS' });
  if (food.s_1_4) opts.push({ key: `${food.id}|s_1_4`, food, sizeLabel: '1/4 cup', sizeValue: parseFloat(food.s_1_4), type: 'LBS' });
  if (food.s_1_2) opts.push({ key: `${food.id}|s_1_2`, food, sizeLabel: '1/2 cup', sizeValue: parseFloat(food.s_1_2), type: 'LBS' });
  if (food.s_3_4) opts.push({ key: `${food.id}|s_3_4`, food, sizeLabel: '3/4 cup', sizeValue: parseFloat(food.s_3_4), type: 'LBS' });
  if (food.ea_value) opts.push({ key: `${food.id}|ea`, food, sizeLabel: food.ea_label || 'EA', sizeValue: parseFloat(food.ea_value), type: 'EA' });
  return opts;
};

const AppContext = createContext<any>(null);
const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // Using v6 for fresh data wipe to support the new 1/16 column
  const [schools, setSchools] = useState(() => JSON.parse(localStorage.getItem('ml_schools_v6') || 'null') || INITIAL_SCHOOLS);
  const [foodCatalog, setFoodCatalog] = useState(() => JSON.parse(localStorage.getItem('ml_food_v6') || 'null') || INITIAL_FOOD_CATALOG);
  const [templates, setTemplates] = useState(() => JSON.parse(localStorage.getItem('ml_templates_v6') || 'null') || INITIAL_TEMPLATES);
  const [weeklyCounts, setWeeklyCounts] = useState(() => JSON.parse(localStorage.getItem('ml_weekly_counts_v6') || 'null') || {});
  const [weeklyMenuIds, setWeeklyMenuIds] = useState(() => JSON.parse(localStorage.getItem('ml_weekly_menu_v6') || 'null') || {});
  const [weeklyOverrides, setWeeklyOverrides] = useState(() => JSON.parse(localStorage.getItem('ml_weekly_overrides_v6') || 'null') || {});
  const [selectedDay, setSelectedDay] = useState('Monday');
  
  const getDefaultDate = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };
  const [weekStartDate, setWeekStartDate] = useState(() => localStorage.getItem('ml_week_start_v6') || getDefaultDate());

  useEffect(() => { localStorage.setItem('ml_schools_v6', JSON.stringify(schools)); }, [schools]);
  useEffect(() => { localStorage.setItem('ml_food_v6', JSON.stringify(foodCatalog)); }, [foodCatalog]);
  useEffect(() => { localStorage.setItem('ml_templates_v6', JSON.stringify(templates)); }, [templates]);
  useEffect(() => { localStorage.setItem('ml_weekly_counts_v6', JSON.stringify(weeklyCounts)); }, [weeklyCounts]);
  useEffect(() => { localStorage.setItem('ml_weekly_menu_v6', JSON.stringify(weeklyMenuIds)); }, [weeklyMenuIds]);
  useEffect(() => { localStorage.setItem('ml_weekly_overrides_v6', JSON.stringify(weeklyOverrides)); }, [weeklyOverrides]);
  useEffect(() => { localStorage.setItem('ml_week_start_v6', weekStartDate); }, [weekStartDate]);

  return (
    <AppContext.Provider value={{
      schools, setSchools, foodCatalog, setFoodCatalog,
      templates, setTemplates, weeklyCounts, setWeeklyCounts,
      weeklyMenuIds, setWeeklyMenuIds, weeklyOverrides, setWeeklyOverrides,
      selectedDay, setSelectedDay, weekStartDate, setWeekStartDate
    }}>
      {children}
    </AppContext.Provider>
  );
};

const DaySelector = () => {
  const { selectedDay, setSelectedDay } = useAppContext();
  return (
    <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-200 no-print">
      {DAYS_OF_WEEK.map(day => (
        <button key={day} onClick={() => setSelectedDay(day)} className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedDay === day ? 'bg-blue-600 text-white shadow-md' : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
          {day}
        </button>
      ))}
    </div>
  );
};

const RosterTab = () => {
  const { schools, setSchools, weeklyCounts, setWeeklyCounts, weeklyMenuIds, setWeeklyMenuIds, weeklyOverrides, setWeeklyOverrides, selectedDay } = useAppContext();
  const [newSchoolCode, setNewSchoolCode] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const dayCounts = weeklyCounts[selectedDay] || {};

  const handleCountChange = (schoolId: string, mealType: string, value: string) => {
    setWeeklyCounts((prev: any) => {
      const currentDay = prev[selectedDay] || {};
      const schoolCounts = currentDay[schoolId] || { Breakfast: '', Lunch: '', Snack: '' };
      return {
        ...prev,
        [selectedDay]: { ...currentDay, [schoolId]: { ...schoolCounts, [mealType]: value === '' ? '' : parseInt(value, 10) } }
      };
    });
  };

  const handleAddSchool = () => {
    if (!newSchoolCode || !newSchoolName) return;
    setSchools([...schools, { id: newSchoolCode.toUpperCase(), code: newSchoolCode.toUpperCase(), name: newSchoolName }]);
    setNewSchoolCode(''); setNewSchoolName('');
  };

  const handleClearWeek = () => {
    setWeeklyCounts({});
    setWeeklyMenuIds({});
    setWeeklyOverrides({});
    setConfirmClear(false);
  };

  const totals = schools.reduce((acc: any, school: any) => {
    const counts = dayCounts[school.id] || {};
    acc.Breakfast += (counts.Breakfast || 0); acc.Lunch += (counts.Lunch || 0); acc.Snack += (counts.Snack || 0);
    return acc;
  }, { Breakfast: 0, Lunch: 0, Snack: 0 });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <DaySelector />
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daily Roster Input</h2>
          <p className="text-gray-500 text-sm">Entering counts for <strong className="text-gray-900">{selectedDay}</strong></p>
        </div>
        <div>
           {confirmClear ? (
             <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
                <span className="text-sm font-bold text-red-600">Are you sure?</span>
                <button onClick={handleClearWeek} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition shadow-sm">Yes, Wipe Week</button>
                <button onClick={() => setConfirmClear(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition shadow-sm">Cancel</button>
             </div>
           ) : (
             <button onClick={() => setConfirmClear(true)} className="text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 px-3 py-2 rounded-md text-sm font-medium transition">
               Clear Entire Week
             </button>
           )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">School</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider bg-blue-900">Breakfast</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider bg-green-900">Lunch</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider bg-orange-900">Snack</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schools.map((school: any) => {
              const counts = dayCounts[school.id] || {};
              return (
                <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSchools(schools.filter((s: any) => s.id !== school.id))} className="text-gray-400 hover:text-red-600 transition-colors" title="Remove School"><Trash2 size={16} /></button>
                      <span className="font-bold text-gray-900">{school.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{school.name}</td>
                  <td className="px-6 py-2 whitespace-nowrap text-center bg-blue-50/30">
                    <input type="number" min="0" value={counts.Breakfast || ''} onChange={(e) => handleCountChange(school.id, 'Breakfast', e.target.value)} className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white" />
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center bg-green-50/30">
                    <input type="number" min="0" value={counts.Lunch || ''} onChange={(e) => handleCountChange(school.id, 'Lunch', e.target.value)} className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border bg-white" />
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-center bg-orange-50/30">
                    <input type="number" min="0" value={counts.Snack || ''} onChange={(e) => handleCountChange(school.id, 'Snack', e.target.value)} className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border bg-white" />
                  </td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td className="px-4 py-3">
                <input type="text" placeholder="Code" value={newSchoolCode} onChange={e => setNewSchoolCode(e.target.value)} className="w-full rounded-md shadow-sm sm:text-sm p-2 border border-gray-300 uppercase" />
              </td>
              <td className="px-4 py-3" colSpan={3}>
                <input type="text" placeholder="New School Name" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} className="w-full rounded-md shadow-sm sm:text-sm p-2 border border-gray-300" />
              </td>
              <td className="px-4 py-3 text-center">
                <button onClick={handleAddSchool} disabled={!newSchoolCode || !newSchoolName} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-md transition-colors w-full flex justify-center shadow-sm"><Plus size={18} /> Add</button>
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-gray-100 font-bold border-t-2 border-gray-300">
            <tr>
              <td colSpan={2} className="px-6 py-4 text-right">TOTALS:</td>
              <td className="px-6 py-4 text-center text-blue-900">{totals.Breakfast}</td>
              <td className="px-6 py-4 text-center text-green-900">{totals.Lunch}</td>
              <td className="px-6 py-4 text-center text-orange-900">{totals.Snack}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const ItemsTab = () => {
  const { foodCatalog, setFoodCatalog } = useAppContext();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [max, setMax] = useState('');
  const [s116, setS116] = useState('');
  const [s18, setS18] = useState('');
  const [s14, setS14] = useState('');
  const [s12, setS12] = useState('');
  const [s34, setS34] = useState('');
  const [eaLbl, setEaLbl] = useState('');
  const [eaVal, setEaVal] = useState('');

  const handleAdd = () => {
    if (!name || !max) return;
    setFoodCatalog([...foodCatalog, {
      id: `f${Date.now()}`, name, category, maxPerContainer: parseFloat(max),
      s_1_16: s116, s_1_8: s18, s_1_4: s14, s_1_2: s12, s_3_4: s34,
      ea_label: eaLbl, ea_value: eaVal ? parseFloat(eaVal) : null
    }]);
    setName(''); setMax(''); setS116(''); setS18(''); setS14(''); setS12(''); setS34(''); setEaLbl(''); setEaVal('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Master Items Database</h2>
        <p className="text-gray-500 text-sm">Define standard serving sizes. Leave cells blank if that size isn't offered. For EA, value should represent the calculation multiplier.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider">Product Name</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider">Category</th>
              <th className="px-2 py-3 text-center font-semibold uppercase tracking-wider bg-red-900" title="Max Per Bag (LBS or Count)">Max/Bag</th>
              <th className="px-2 py-3 text-center font-semibold uppercase tracking-wider">1/16 cup</th>
              <th className="px-2 py-3 text-center font-semibold uppercase tracking-wider">1/8 cup</th>
              <th className="px-2 py-3 text-center font-semibold uppercase tracking-wider">1/4 cup</th>
              <th className="px-2 py-3 text-center font-semibold uppercase tracking-wider">1/2 cup</th>
              <th className="px-2 py-3 text-center font-semibold uppercase tracking-wider">3/4 cup</th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-wider bg-purple-900" colSpan={2}>EA (Count)</th>
              <th className="px-2 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {foodCatalog.map((food: any) => (
              <tr key={food.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{food.name}</td>
                <td className="px-4 py-3 text-gray-600">{food.category}</td>
                <td className="px-2 py-3 text-center font-bold text-red-700">{food.maxPerContainer}</td>
                <td className="px-2 py-3 text-center text-gray-600">{food.s_1_16 || '-'}</td>
                <td className="px-2 py-3 text-center text-gray-600">{food.s_1_8 || '-'}</td>
                <td className="px-2 py-3 text-center text-gray-600">{food.s_1_4 || '-'}</td>
                <td className="px-2 py-3 text-center text-gray-600">{food.s_1_2 || '-'}</td>
                <td className="px-2 py-3 text-center text-gray-600">{food.s_3_4 || '-'}</td>
                <td className="px-2 py-3 text-right text-gray-600">{food.ea_label || '-'}</td>
                <td className="px-2 py-3 text-left text-gray-600">{food.ea_value ? `(${food.ea_value})` : ''}</td>
                <td className="px-2 py-3 text-center">
                  <button onClick={() => setFoodCatalog(foodCatalog.filter((f:any) => f.id !== food.id))} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td className="p-2"><input type="text" placeholder="New Item" value={name} onChange={e=>setName(e.target.value)} className="w-full p-1 border border-gray-300 rounded shadow-sm" /></td>
              <td className="p-2">
                <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full p-1 border border-gray-300 rounded bg-white shadow-sm">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </td>
              <td className="p-2"><input type="number" step="0.1" placeholder="Max" value={max} onChange={e=>setMax(e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center shadow-sm" /></td>
              <td className="p-2"><input type="number" step="0.01" placeholder="LBS" value={s116} onChange={e=>setS116(e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center shadow-sm" /></td>
              <td className="p-2"><input type="number" step="0.01" placeholder="LBS" value={s18} onChange={e=>setS18(e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center shadow-sm" /></td>
              <td className="p-2"><input type="number" step="0.01" placeholder="LBS" value={s14} onChange={e=>setS14(e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center shadow-sm" /></td>
              <td className="p-2"><input type="number" step="0.01" placeholder="LBS" value={s12} onChange={e=>setS12(e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center shadow-sm" /></td>
              <td className="p-2"><input type="number" step="0.01" placeholder="LBS" value={s34} onChange={e=>setS34(e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center shadow-sm" /></td>
              <td className="p-2"><input type="text" placeholder="e.g. 4 Ea" value={eaLbl} onChange={e=>setEaLbl(e.target.value)} className="w-20 p-1 border border-gray-300 rounded shadow-sm" /></td>
              <td className="p-2"><input type="number" step="0.01" placeholder="Val" value={eaVal} onChange={e=>setEaVal(e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center shadow-sm" /></td>
              <td className="p-2 text-center">
                <button onClick={handleAdd} disabled={!name || !max} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-1 rounded w-full flex justify-center shadow-sm transition-colors"><Plus size={16}/></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddItemDropdown = ({ onAdd, colorClass }: { onAdd: (key: string) => void, colorClass: string }) => {
  const { foodCatalog } = useAppContext();
  
  return (
    <select 
      value="" 
      onChange={(e) => onAdd(e.target.value)} 
      className={`w-full rounded-md border-gray-300 focus:border-${colorClass}-500 focus:ring-${colorClass}-500 sm:text-sm p-2 border bg-white shadow-sm cursor-pointer`}
    >
      <option value="" disabled>+ Add Item...</option>
      {CATEGORIES.map(category => {
        const catFoods = foodCatalog.filter((f: any) => f.category === category);
        if (catFoods.length === 0) return null;
        
        return (
          <optgroup key={category} label={category}>
            {catFoods.map((food: any) => {
              const options = getAvailableOptions(food);
              return options.map(opt => (
                <option key={opt.key} value={opt.key}>
                  {opt.food.name} - {opt.sizeLabel}
                </option>
              ));
            })}
          </optgroup>
        );
      })}
    </select>
  );
};

const TemplateBuilderTab = () => {
  const { templates, setTemplates, foodCatalog, selectedDay } = useAppContext();
  const [editingId, setEditingId] = useState('');
  const [newName, setNewName] = useState('');

  const activeTemplate = templates.find((t: any) => t.id === editingId);
  const dayMenuKeys = activeTemplate ? (activeTemplate.days[selectedDay] || []) : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault(); if (!newName) return;
    const nt = { id: `t${Date.now()}`, name: newName, days: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] } };
    setTemplates([...templates, nt]); setEditingId(nt.id); setNewName('');
  };

  const addItem = (mealType: string, key: string) => {
    const fullKey = `${mealType}|${key}`;
    setTemplates((prev: any[]) => prev.map(t => {
      if (t.id !== editingId) return t;
      const current = t.days[selectedDay] || [];
      if (current.includes(fullKey)) return t;
      return { ...t, days: { ...t.days, [selectedDay]: [...current, fullKey] } };
    }));
  };

  const removeItem = (fullKey: string) => {
    setTemplates((prev: any[]) => prev.map(t => {
      if (t.id !== editingId) return t;
      return { ...t, days: { ...t.days, [selectedDay]: (t.days[selectedDay] || []).filter((k: string) => k !== fullKey) } };
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Template Builder</h2>
        <p className="text-gray-500 text-sm">Build multi-day menus. Changes here do NOT affect the active week until applied.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
        <div className="flex-1">
          <label className="block text-xs font-bold text-purple-900 mb-1">Create New</label>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input type="text" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Template Name" className="flex-1 rounded-md sm:text-sm p-2 border border-gray-300 shadow-sm" />
            <button type="submit" disabled={!newName} className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md shadow-sm transition-colors"><Plus size={16}/></button>
          </form>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-purple-900 mb-1">Edit Existing</label>
          <select value={editingId} onChange={e=>setEditingId(e.target.value)} className="w-full border-gray-300 bg-white rounded-md p-2 shadow-sm sm:text-sm border cursor-pointer">
            <option value="">-- Select Template --</option>
            {templates.map((t:any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {activeTemplate && (
        <>
          <DaySelector />
          <div className="grid md:grid-cols-3 gap-6">
            {['Breakfast', 'Lunch', 'Snack'].map(meal => {
              const colorClass = meal === 'Breakfast' ? 'blue' : meal === 'Lunch' ? 'green' : 'orange';
              const mealKeys = dayMenuKeys.filter((k: string) => k.startsWith(`${meal}|`));
              
              return (
                <div key={meal} className={`bg-white rounded-xl shadow-sm border-t-4 border-${colorClass}-500 flex flex-col h-[400px]`}>
                  <div className={`bg-${colorClass}-50 px-4 py-3 border-b border-${colorClass}-100 flex justify-between items-center`}>
                    <h3 className={`font-bold text-${colorClass}-900`}>{meal}</h3>
                    <span className={`text-xs bg-${colorClass}-200 text-${colorClass}-800 px-2 py-1 rounded-full font-bold`}>{mealKeys.length} Items</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {mealKeys.map((fullKey: string) => {
                      const [_, fId, sKey] = fullKey.split('|');
                      const food = foodCatalog.find((f:any) => f.id === fId);
                      if (!food) return null;
                      const sizeLabel = sKey === 'ea' ? food.ea_label : sKey.replace('s_', '').replace('_', '/') + ' cup';
                      
                      return (
                        <div key={fullKey} className="flex justify-between items-center bg-gray-50 border p-2 rounded-lg group">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{food.name}</div>
                            <div className="text-xs text-gray-500">{sizeLabel} • Max {food.maxPerContainer}</div>
                          </div>
                          <button onClick={() => removeItem(fullKey)} className="text-gray-400 hover:text-red-500 p-1 transition-colors"><X size={18} /></button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-gray-50 p-3 border-t border-gray-100 shrink-0">
                    <AddItemDropdown onAdd={(key) => addItem(meal, key)} colorClass={colorClass} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const MenuPlannerTab = () => {
  const { templates, weeklyMenuIds, setWeeklyMenuIds, foodCatalog, selectedDay } = useAppContext();
  const dayMenuKeys = weeklyMenuIds[selectedDay] || [];

  const addItem = (mealType: string, key: string) => {
    const fullKey = `${mealType}|${key}`;
    setWeeklyMenuIds((prev: any) => {
      const current = prev[selectedDay] || [];
      if (current.includes(fullKey)) return prev;
      return { ...prev, [selectedDay]: [...current, fullKey] };
    });
  };

  const removeItem = (fullKey: string) => {
    setWeeklyMenuIds((prev: any) => ({
      ...prev, [selectedDay]: (prev[selectedDay] || []).filter((k: string) => k !== fullKey)
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div>
          <h3 className="font-bold text-blue-900 text-lg">Apply Prebuilt Template</h3>
          <p className="text-sm text-blue-700">Load a saved menu for the entire week.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {templates.map((t: any) => (
             <button key={t.id} onClick={() => setWeeklyMenuIds(t.days)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold hover:bg-blue-700 transition">
               Apply {t.name}
             </button>
          ))}
        </div>
      </div>

      <DaySelector />

      <div className="grid md:grid-cols-3 gap-6">
        {['Breakfast', 'Lunch', 'Snack'].map(meal => {
          const colorClass = meal === 'Breakfast' ? 'blue' : meal === 'Lunch' ? 'green' : 'orange';
          const mealKeys = dayMenuKeys.filter((k: string) => k.startsWith(`${meal}|`));

          return (
            <div key={meal} className={`bg-white rounded-xl shadow-sm border-t-4 border-${colorClass}-500 flex flex-col h-[400px]`}>
              <div className={`bg-${colorClass}-50 px-4 py-3 border-b border-${colorClass}-100 flex justify-between items-center`}>
                <h3 className={`font-bold text-${colorClass}-900`}>{meal}</h3>
                <span className={`text-xs bg-${colorClass}-200 text-${colorClass}-800 px-2 py-1 rounded-full font-bold`}>{mealKeys.length} Items</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {mealKeys.map((fullKey: string) => {
                  const [_, fId, sKey] = fullKey.split('|');
                  const food = foodCatalog.find((f:any) => f.id === fId);
                  if (!food) return null;
                  const sizeLabel = sKey === 'ea' ? food.ea_label : sKey.replace('s_', '').replace('_', '/') + ' cup';
                  
                  return (
                    <div key={fullKey} className="flex justify-between items-center bg-gray-50 border p-2 rounded-lg group">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{food.name}</div>
                        <div className="text-xs text-gray-500">{sizeLabel} • Max {food.maxPerContainer}</div>
                      </div>
                      <button onClick={() => removeItem(fullKey)} className="text-gray-400 hover:text-red-500 p-1 transition-colors"><X size={18} /></button>
                    </div>
                  );
                })}
              </div>
              <div className="bg-gray-50 p-3 border-t border-gray-100 shrink-0">
                <AddItemDropdown onAdd={(key) => addItem(meal, key)} colorClass={colorClass} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ReviewTab = () => {
  const { schools, weeklyCounts, weeklyMenuIds, weeklyOverrides, setWeeklyOverrides, foodCatalog } = useAppContext();

  const handleOverride = (aggKey: string, value: string) => {
    setWeeklyOverrides((prev: any) => {
      const overrides = { ...prev };
      if (value === '') delete overrides[aggKey]; else overrides[aggKey] = parseInt(value, 10);
      return overrides;
    });
  };

  const rows: any[] = [];
  schools.forEach((school: any) => {
    const schoolAggregations: any = {};
    
    DAYS_OF_WEEK.forEach(day => {
      const dayCounts = weeklyCounts[day] || {};
      const dayMenuKeys = weeklyMenuIds[day] || [];

      dayMenuKeys.forEach((menuKey: string) => {
        const [mealType, fId, sKey] = menuKey.split('|');
        const item = foodCatalog.find((f: any) => f.id === fId);
        if (!item) return;

        const studentCount = dayCounts[school.id]?.[mealType] || 0;
        if (studentCount <= 0) return;

        const isEa = sKey === 'ea';
        const sizeValue = isEa ? item.ea_value : item[sKey];
        if (!isEa && !sizeValue) return;

        const sizeLabel = isEa ? item.ea_label || 'EA' : sKey.replace('s_', '').replace('_', '/') + ' cup';
        const eaValue = isEa ? (parseFloat(item.ea_value) || 1) : null;
        
        // Calculation Logic:
        // EA items: 1 serving = 1 student. Weight items: student count * weight.
        const dailyRawTotal = isEa ? studentCount : studentCount * parseFloat(sizeValue);
        const aggKey = `${school.id}-${menuKey}`;

        if (!schoolAggregations[aggKey]) {
          schoolAggregations[aggKey] = {
            school, itemKey: menuKey, mealType, itemName: item.name, 
            sizeLabel, max: item.maxPerContainer, isEa, eaValue, totalRaw: 0,
            servingDays: [], aggKey
          };
        }
        
        schoolAggregations[aggKey].totalRaw += dailyRawTotal;
        const shortDay = day.substring(0,3);
        if (!schoolAggregations[aggKey].servingDays.includes(shortDay)) schoolAggregations[aggKey].servingDays.push(shortDay);
      });
    });

    Object.values(schoolAggregations).forEach(agg => rows.push(agg));
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
         <h2 className="text-2xl font-bold text-gray-800">Weekly Review & Overrides</h2>
         <p className="text-gray-500 text-sm">Reviewing aggregated totals for the entire week. Overrides applied here affect the weekly container batch.</p>
      </div>
      
      {rows.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
          <Calculator className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">Nothing to calculate for the week</h3>
          <p className="text-gray-500">Ensure you have entered Student Counts and added items to the Menu Planner.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Menu Item</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Days Served</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calculated Weekly Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Override Containers</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map(r => {
                // Round up EA items to the nearest package size multiple
                const finalTotal = r.isEa && r.eaValue ? Math.ceil(r.totalRaw / r.eaValue) * r.eaValue : r.totalRaw;
                const displayTotal = r.isEa ? `${finalTotal} EA` : `${finalTotal.toFixed(2)} LBS`;
                const stdContainers = Math.ceil(finalTotal / r.max);
                const currentOverride = weeklyOverrides[r.aggKey];

                return (
                  <tr key={r.aggKey} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="font-bold text-gray-900">{r.school.code}</div><div className="text-xs text-gray-500">{r.school.name}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">{r.itemName}</div><div className="text-xs text-gray-500">{r.mealType} • {r.sizeLabel}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-semibold text-gray-700">{r.servingDays.join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{displayTotal}</div>
                      {r.isEa && r.eaValue > 1 && (
                        <div className="text-[10px] text-blue-600 mb-1 font-semibold">
                          Students: {r.totalRaw} (Rnd to {r.eaValue}s)
                        </div>
                      )}
                      <div className={`text-xs ${currentOverride ? "line-through text-gray-400" : "text-gray-500"}`}>Standard: {stdContainers} containers</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <input type="number" min="1" placeholder="Auto" value={currentOverride || ''} onChange={(e) => handleOverride(r.aggKey, e.target.value)} className={`w-20 rounded-md shadow-sm sm:text-sm p-2 border ${currentOverride ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50' : 'border-gray-300 focus:border-blue-500'}`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const PrintTab = () => {
  const { schools, weeklyCounts, weeklyMenuIds, weeklyOverrides, foodCatalog, weekStartDate, setWeekStartDate } = useAppContext();

  const getWeekDateRange = () => {
    if (!weekStartDate) return '';
    const [year, month, day] = weekStartDate.split('-');
    const start = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 4); 
    
    const formatZero = (n: number) => n < 10 ? '0' + n : n;
    return `${formatZero(start.getMonth() + 1)}/${formatZero(start.getDate())}-${formatZero(end.getMonth() + 1)}/${formatZero(end.getDate())}`;
  };

  const generatedLabels = useMemo(() => {
    let labels: any[] = [];
    const dateRangeStr = getWeekDateRange();
    
    schools.forEach((school: any) => {
      const schoolAggregations: any = {};

      DAYS_OF_WEEK.forEach(day => {
        const dayCounts = weeklyCounts[day] || {};
        const dayMenuKeys = weeklyMenuIds[day] || [];
        
        dayMenuKeys.forEach((menuKey: string) => {
          const [mealType, fId, sKey] = menuKey.split('|');
          const studentCount = dayCounts[school.id]?.[mealType] || 0;
          if (studentCount <= 0) return;

          const item = foodCatalog.find((f: any) => f.id === fId);
          if (!item) return;

          const isEa = sKey === 'ea';
          const sizeValue = isEa ? item.ea_value : item[sKey];
          if (!isEa && !sizeValue) return;

          const sizeLabel = isEa ? item.ea_label || 'EA' : sKey.replace('s_', '').replace('_', '/') + ' CUP';
          const eaValue = isEa ? (parseFloat(item.ea_value) || 1) : null;
          
          // Same logic as Review Tab
          const dailyRawTotal = isEa ? studentCount : studentCount * parseFloat(sizeValue);
          const aggKey = `${school.id}-${menuKey}`;
          const displayMealType = mealType.toUpperCase() === 'BREAKFAST' ? 'BK' : mealType.toUpperCase();
          
          if (!schoolAggregations[aggKey]) {
            schoolAggregations[aggKey] = {
              schoolCode: school.code, itemName: item.name, mealType: displayMealType,
              servingSize: sizeLabel, isEa, max: item.maxPerContainer, eaValue, totalRaw: 0, aggKey
            };
          }
          schoolAggregations[aggKey].totalRaw += dailyRawTotal;
        });
      });

      Object.values(schoolAggregations).forEach((agg: any) => {
        // Round up EA items to the nearest package size multiple
        const finalTotal = agg.isEa && agg.eaValue ? Math.ceil(agg.totalRaw / agg.eaValue) * agg.eaValue : agg.totalRaw;
        
        let totalContainers = weeklyOverrides[agg.aggKey] || Math.ceil(finalTotal / agg.max);
        totalContainers = Math.max(1, totalContainers); 
        
        const valuePerContainer = (finalTotal / totalContainers);
        const displayValue = agg.isEa ? Math.ceil(valuePerContainer) + ' EA' : valuePerContainer.toFixed(2) + ' LBS';

        for (let i = 1; i <= totalContainers; i++) {
          labels.push({
            id: `${agg.aggKey}-${i}`,
            schoolCode: agg.schoolCode, itemName: agg.itemName, mealType: agg.mealType,
            servingSize: agg.servingSize, totalUnit: displayValue, dateRangeStr, 
            currentContainer: i, totalContainers: totalContainers
          });
        }
      });
    });
    return labels;
  }, [schools, weeklyCounts, weeklyMenuIds, weeklyOverrides, foodCatalog, weekStartDate]);

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 no-print bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Print Weekly Batch</h2>
          <p className="text-gray-500 text-sm">Generating combined labels for the entire week.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">Week Of (Monday)</label>
             <input type="date" value={weekStartDate} onChange={(e) => setWeekStartDate(e.target.value)} className="w-40 rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border bg-white" />
          </div>
          <button onClick={() => window.print()} disabled={generatedLabels.length === 0} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 mt-5 transition-colors">
            <Printer size={18} /> Print {generatedLabels.length} Labels
          </button>
        </div>
      </div>

      {generatedLabels.length === 0 && (
        <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300 no-print">
          <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">No labels to print</h3>
          <p className="text-gray-500">Ensure counts and menus are filled out for the week.</p>
        </div>
      )}

      <div id="print-section" className="bg-white shadow-lg p-8 rounded-lg max-w-5xl mx-auto print:shadow-none print:p-0 print:max-w-none print:bg-transparent">
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              #print-section, #print-section * { visibility: visible; }
              #print-section { position: absolute; left: 0; top: 0; width: 100%; margin: 0; }
              .no-print { display: none !important; }
              
              @page { size: letter; margin: 0.5in 0.1875in 0.5in 0.1875in; }
              
              .avery-grid {
                display: grid !important;
                grid-template-columns: repeat(3, 2.625in) !important;
                column-gap: 0.125in !important;
                row-gap: 0 !important;
              }
              .avery-label {
                width: 2.625in !important;
                height: 1in !important;
                padding: 0.05in 0.15in !important;
                page-break-inside: avoid;
                border: none !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
              }
            }
          `}
        </style>
        <div className="avery-grid grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-0">
          {generatedLabels.map((label: any) => (
            <div key={label.id} className="avery-label border border-dashed border-gray-400 font-bold flex flex-col justify-center text-[10px] leading-[1.3] text-black w-[2.625in] h-[1in] mx-auto md:mx-0">
               <div className="uppercase text-center mb-[2px]"><span className="mr-1">{label.schoolCode}</span> {label.mealType}:{label.itemName}</div>
               <div className="flex justify-between px-6">
                 <span>{label.servingSize}</span>
                 <span>{label.dateRangeStr}</span>
               </div>
               <div className="flex justify-between px-6">
                 <span>{label.totalUnit}</span>
                 <span>{label.currentContainer}-{label.totalContainers}</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('data-entry');
  const [showBackupMenu, setShowBackupMenu] = useState(false);
  const context = useAppContext();

  const handleExport = () => {
    const data = {
      schools: context.schools,
      foodCatalog: context.foodCatalog,
      templates: context.templates,
      weeklyCounts: context.weeklyCounts,
      weeklyMenuIds: context.weeklyMenuIds,
      weeklyOverrides: context.weeklyOverrides,
      weekStartDate: context.weekStartDate
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kitchenlabel-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setShowBackupMenu(false);
  };

  const handleImport = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const data = JSON.parse(event.target.result);
        if(data.schools) context.setSchools(data.schools);
        if(data.foodCatalog) context.setFoodCatalog(data.foodCatalog);
        if(data.templates) context.setTemplates(data.templates);
        if(data.weeklyCounts) context.setWeeklyCounts(data.weeklyCounts);
        if(data.weeklyMenuIds) context.setWeeklyMenuIds(data.weeklyMenuIds);
        if(data.weeklyOverrides) context.setWeeklyOverrides(data.weeklyOverrides);
        if(data.weekStartDate) context.setWeekStartDate(data.weekStartDate);
        setShowBackupMenu(false);
      } catch(err) {
        console.error("Invalid backup file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-12">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm no-print sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black tracking-tight text-blue-900 flex items-center gap-2">
              <CheckSquare className="text-blue-600" /> KitchenLabel Pro
            </h1>
            <div className="relative">
               <button onClick={() => setShowBackupMenu(!showBackupMenu)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
                 <Save size={14} /> Data Backup
               </button>
               {showBackupMenu && (
                 <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    <button onClick={handleExport} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2">
                      <Download size={16} /> Export to File
                    </button>
                    <label className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 cursor-pointer">
                      <Upload size={16} /> Import from File
                      <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                    </label>
                 </div>
               )}
            </div>
          </div>
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
            <button onClick={() => setActiveTab('items')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 whitespace-nowrap ${activeTab === 'items' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><Package size={16} /> Items</button>
            <button onClick={() => setActiveTab('templates')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 whitespace-nowrap ${activeTab === 'templates' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><BookOpen size={16} /> Templates</button>
            <div className="w-px bg-gray-300 mx-1 shrink-0"></div>
            <button onClick={() => setActiveTab('data-entry')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 whitespace-nowrap ${activeTab === 'data-entry' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><ClipboardList size={16} /> 1. Roster</button>
            <button onClick={() => setActiveTab('menu-planner')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 whitespace-nowrap ${activeTab === 'menu-planner' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><Utensils size={16} /> 2. Menu</button>
            <button onClick={() => setActiveTab('review')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 whitespace-nowrap ${activeTab === 'review' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><Calculator size={16} /> 3. Review</button>
            <button onClick={() => setActiveTab('print')} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 whitespace-nowrap ${activeTab === 'print' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}><Printer size={16} /> 4. Print</button>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6 mt-2">
        {activeTab === 'items' && <ItemsTab />}
        {activeTab === 'templates' && <TemplateBuilderTab />}
        {activeTab === 'data-entry' && <RosterTab />}
        {activeTab === 'menu-planner' && <MenuPlannerTab />}
        {activeTab === 'review' && <ReviewTab />}
        {activeTab === 'print' && <PrintTab />}
      </main>
    </div>
  );
};

export default function App() {
  return <AppProvider><MainLayout /></AppProvider>;
}