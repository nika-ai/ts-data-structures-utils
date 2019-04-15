export class StringUtils {
    static ucfirst(str:string):string {
        if (str.length < 1) return str;
        return str[0].toUpperCase() + str.substr(1);
    }

    /**
     * Changes 'Camel Case' style to 'Underscore' style.
     */
    static camelToUnderscore(str:string):string {
        if (!str) return '';

        try {
            return str.split(/(?=[A-Z])/).join('_').toLowerCase();
        } catch (e) {
            return str;
        }
    }
}