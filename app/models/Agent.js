import Trash from './Trash';

export default class Agent {
    /**
     *
     * @param name
     * @param hold {Trash}
     */
    constructor(numberOfOrganicDirt, numberOfGarbageDirt) {
        this.numberOfOrganicDirt = numberOfOrganicDirt;
        this.numberOfGarbageDirt = numberOfGarbageDirt;
    }
};