import Agent from './models/Agent';
import Trash from './models/Trash';
import Environment from "./models/Environment";

let environmentSize = 30;
let agents = 2;
let organicTrash = 2;
let garbageTrash = 2;
let organicDirt = 6;
let garbageDirt = 6;

let environment = new Environment(environmentSize);

console.log(environment);