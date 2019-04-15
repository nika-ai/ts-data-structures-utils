export class ArrayUtils {
    static getUniqueItems<T>(arr:Array<T>):Array<T> {
        return arr.filter((item, i) => arr.indexOf(item) === i);
    }

    /**
     * Returns common items of arrays.
     */
    static getCommon<T>(left:Array<T>, right:Array<T>):Array<T> {
        const common:Array<T> = [];

        left.forEach(item => {
            if (right.indexOf(item) < 0) return;
            common.push(item);
        });

        return this.getUniqueItems(common);
    }

    static getRandom<T>(arr:Array<T>):T {
        const randIndex = Math.random() * arr.length >> 0;

        return arr[randIndex];
    }
}