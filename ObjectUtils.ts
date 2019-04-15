import objectAssignDeep from './ObjectAssignDeep';

export class ObjectUtils {
    static getClone<T>(obj:{}|Array<any>):T {
        return obj ? JSON.parse(JSON.stringify(obj)) : {};
    }

    static assignDeep<T>(...args:Array<{}>):T {
        return objectAssignDeep.apply(objectAssignDeep, args);
    }

    static freezeDeep<T extends Object>(obj:{[key:string]:any}&T):Readonly<T> {
        const propNames = Object.getOwnPropertyNames(obj);

        propNames.forEach(name => {
            const prop:any = obj[name];

            if (typeof prop == 'object' && prop !== null)
                this.freezeDeep(prop);
        });

        return Object.freeze(obj);
    }
}