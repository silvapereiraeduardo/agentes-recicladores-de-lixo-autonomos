export default class Field {
    /**
     * Inicializa os Campos
     * @param top - Instancia do Campo a cima ou valor Null caso não haja outro campo
     * @param left - Instancia do Campo a esquerda ou valor Null caso não haja outro campo
     * @param bottom - Instancia do Campo a baixo ou valor Null caso não haja outro campo
     * @param right - Instancia do Campo a direita ou valor Null caso não haja outro campo
     * @param hold - instacia do objeto presente do campo ou valor null caso esteja vazio o campo
     */
    constructor(top, left, bottom, right, hold) {
        this.top = top;
        this.left = left;
        this.bottom = bottom;
        this.right = right;
        this.hold = hold;
    }
}