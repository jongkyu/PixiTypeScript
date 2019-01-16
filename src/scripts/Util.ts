import { Coroutine, CoroutineValidator, CoroutineManager, WaitForSeconds } from "./CoroutineManager";
import * as PIXI from "pixi.js";

export class Pair<K, V> {
    constructor(public key: K, public value: V) { }
}

export class MyMath {

    static MAX_VALUE = Number.MAX_VALUE || 9007199254740991;
    static MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    static MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -9007199254740991;
    static NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY || -9007199254740991;


    static clamp(value: number, min: number = 0, max: number = 1): number {
        return Math.min(max, Math.max(min, value));
    }

    static lerp(ratio: number, min: number, max: number): number {
        return min * (1 - ratio) + max * ratio;
    }

    // [min, max] in Z-space
    static randomRangeIntMaxInclusive(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // [min, max) in Z-space
    static randomRangeInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // [min, max) in R-space
    static randomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}

export class Util {
    static loadScript(url: string): Promise<void> {
        return new Promise<void>((resolve: Action0, reject: Action1<string>) => {

            var script = document.createElement("script") as HTMLScriptElement;
            script.type = "text/javascript";
            script.onload = () => resolve();
            script.src = url;
            script.async = true;
            document.getElementsByTagName("head")[0].appendChild(script);

        });
    }


    static ensurePromise<T>(promise: Promise<T>, then: Action1<T>) {
        promise.then(then)
            .catch((reason: Action1<any>) => {
                //Global.onError(reason);
            });
    }


    //http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
    static isNumeric(value?: any) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }



    // like Array.map()
    static objectMap<T>(obj: any, callbackfn: (key: string, value: any) => T): T[] {
        let array: T[] = [];
        for (let key in obj) {
            let value = obj[key];
            array.push(callbackfn(key, value));
        }

        return array;
    }

    // like Array.forEach()
    static objectForEach<V>(obj: { [key: string]: V }, callbackfn: Action2<string | number, V>) {
        for (let key in obj) {
            let value = obj[key];
            callbackfn(key, value);
        }
    }


    // like Array.filter()
    static objectFilter<V>(obj: { [id: string]: V }, callbackfn: (key: string, value: V) => boolean): Pair<string, V>[] {
        let array: Pair<string, V>[] = [];
        for (let key in obj) {
            let value = obj[key];
            if (callbackfn(key, value)) {
                array.push(new Pair(key, value));
            }
        }

        return array;
    }

    static clone<T>(originalObject: T, circular?: boolean): T {
        // First create an empty object with
        // same prototype of our original source
        if (originalObject === null || originalObject === undefined) { return originalObject; }

        var propertyIndex: number,
            descriptor: PropertyDescriptor,
            keys: string[],
            current: { source: any, target: any } | undefined,
            nextSource: any,
            indexOf: number,
            copies = [{
                source: originalObject,
                target: Array.isArray(originalObject) ? [] : Object.create(Object.getPrototypeOf(originalObject))
            }],
            cloneObject = copies[0].target,
            sourceReferences = [originalObject],
            targetReferences = [cloneObject];

        // First in, first out
        while (current = copies.shift()) {
            keys = Object.getOwnPropertyNames(current.source);

            for (propertyIndex = 0; propertyIndex < keys.length; propertyIndex++) {
                // Save the source's descriptor
                descriptor = Object.getOwnPropertyDescriptor(current.source, keys[propertyIndex])!;

                if (!descriptor.value || typeof descriptor.value !== "object") {
                    Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                    continue;
                }

                nextSource = descriptor.value;
                descriptor.value = Array.isArray(nextSource) ? [] : Object.create(Object.getPrototypeOf(nextSource));

                if (circular) {
                    indexOf = sourceReferences.indexOf(nextSource);

                    if (indexOf !== -1) {
                        // The source is already referenced, just assign reference
                        descriptor.value = targetReferences[indexOf];
                        Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                        continue;
                    }

                    sourceReferences.push(nextSource);
                    targetReferences.push(descriptor.value);
                }

                Object.defineProperty(current.target, keys[propertyIndex], descriptor);

                copies.push({ source: nextSource, target: descriptor.value });
            }
        }

        return cloneObject;
    }

    static waitForSignal(checkFunc: Func0<boolean>, executor: PIXI.Container | null = null): Coroutine {
        return CoroutineManager.startCoroutine(this.waitForSignalCoroutine(checkFunc), executor);
    }

    private static *waitForSignalCoroutine<R>(checkFunc: Func0<boolean>) {
        while (!checkFunc()) { yield; }
    }

    static waitForPromise<T>(promise: Promise<T>, executor: PIXI.Container | null = null): Coroutine {
        return CoroutineManager.startCoroutine(this.waitForPromiseCoroutine(promise), executor);
    }

    private static *waitForPromiseCoroutine<T>(promise: Promise<T>) {
        let done = false;
        let ret: T | undefined;

        this.ensurePromise(promise, (v: T) => { ret = v; done = true; });
        while (!done) { yield; }
        return ret!;
    }

    static waitForCoroutines(coroutines: Coroutine[], onFinish?: Action0, executor: PIXI.Container | null = null): Coroutine {
        return CoroutineManager.startCoroutine(this.waitForCoroutineCoroutine(coroutines, onFinish), executor);
    }

    private static *waitForCoroutineCoroutine(coroutines: Coroutine[], finishCallback?: Action0) {
        while (coroutines.find(coroutine => !coroutine.done)) yield;

        finishCallback && finishCallback();
    }


    static delayedAction(seconds: number, action: Action0, executor: CoroutineValidator = null): Coroutine {
        return CoroutineManager.startCoroutine(this.delayedActionCoroutine(seconds, action), executor);
    }

    private static *delayedActionCoroutine(seconds: number, action: () => void) {
        yield new WaitForSeconds(seconds);

        action();
    }


    static delay(ms: number) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }
}


export class StringUtil {
    static isNullOrEmpty(str?: string): boolean {
        return !str || str === "";
    }

    static getLastChar(str: string): string {
        return str[str.length - 1];
    }

    static format(format: string, ...args: any[]): string {
        let s = format;
        for (let i = 0; i < args.length; i++) {
            let reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, args[i].toString());
        }

        return s;
    }


    static abbreviateNumber(value: number, precision = 2) {
        let suffixes = ["", "K", "M", "B", "T"];
        let suffix = '';

        let newValue = value;
        for (let i = suffixes.length - 1; i > 0; i--) {
            let basis = Math.pow(1000, i);
            if (value >= basis) {
                newValue = value / basis;
                suffix = suffixes[i];
                break;
            }
        }

        return (newValue).toFixed(precision).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1') + suffix;
    }

    static currencyFormat(number: number, decimalPoint = 2): string {
        if (number === 0) return "0";
        return number.toFixed(decimalPoint).replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,');
    }

    static zeroPad(number: number, size = 3): string {
        let s = StringUtil.repeat("0", size) + number;
        return s.substr(s.length - size);
    }

    static repeat(str: string, size: number) {
        let result = "";
        for (let i = 0; i < size; i++) {
            result += str;
        }
        return result;
    }

    private static readonly possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
    static randomString(length: number): string {
        let text = "";

        for (let i = 0; i < length; i++) {
            text += this.possible.charAt(Math.floor(Math.random() * this.possible.length));
        }

        return text;
    }

    static getQueryString(url: string, paramName: string): string | null {
        let urlTemp = url.substring(1);
        let tempArray = urlTemp.split('&');
        for (let i = 0; i < tempArray.length; ++i) {
            let pair = tempArray[i].split('=');

            if (pair[0] === paramName) {
                return pair[1];
            }
        }
        return null;
    }

}
