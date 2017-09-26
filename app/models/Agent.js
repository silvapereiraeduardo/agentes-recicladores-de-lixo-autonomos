import Trash from './Trash';

export default class Agent {
    /**
     *
     * @param name
     * @param hold {Trash}
     */
    constructor(name, hold) {
        this.name = name;
        this.hold = hold;
    }
};