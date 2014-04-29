declare module plat {
    module register {
        /**
        * Registers the IApp with the framework. The framework will instantiate the IApp when needed, and wire up
        * the Application Lifecycle events. The dependencies array corresponds to injectables that will be
        * passed into the Constructor of the app.
        *
        * @param name The name of your app.
        * @param Type The constructor for the IApp.
        * @param dependencies An array of strings representing the dependencies needed for the app injector.
        */
        function app(name: string, Type: new(...args: any[]) => IApp, dependencies?: any[]): typeof register;
        /**
        * Registers an IControl with the framework. The framework will instantiate the IControl when needed. The
        * dependencies array corresponds to injectables that will be passed into the Constructor of the control.
        *
        * @param name The control type, corresponding to the HTML notation for creating a new IControl (e.g. 'plat-foreach').
        * @param Type The constructor for the IControl.
        * @param dependencies An array of strings representing the dependencies needed for the IControl injector.
        *
        * @example register.control('plat-tap', Tap, [plat.expressions.Parser]);
        */
        function control(name: string, Type: new(...args: any[]) => IControl, dependencies?: any[]): typeof register;
        /**
        * Registers a ViewControl with the framework. The framework will instantiate the IControl when needed. The
        * dependencies array corresponds to injectables that will be passed into the Constructor of the control.
        *
        * @param name The control type, corresponding to the HTML notation for creating a new IViewControl. Used for navigation
        * to the specified ViewControl.
        * @param Type The constructor for the IViewControl.
        * @param dependencies An optional array of strings representing the dependencies needed for the IViewControl injector.
        * @param routes Optional route strings (or regular expressions) used for matching a URL to the registered IViewControl.
        *
        * @example register.viewControl('my-view-control', MyViewControl, null, ['customers/:customer(/:ordernumber)']);
        */
        function viewControl(name: string, Type: new(...args: any[]) => ui.IViewControl, dependencies?: any[], routes?: any[]): typeof register;
        /**
        * Registers an injectable with the framework. Injectables are objects that can be used for dependency injection into other objects.
        * The dependencies array corresponds to injectables that will be passed into the Constructor of the injectable.
        *
        * @param name The name of the injector, used when another component is specifying dependencies.
        * @param dependencies An array of strings representing the dependencies needed for the injectable's injector.
        * @param Type The constructor for the injectable. The injectable will only be instantiated once during the application
        * lifetime.
        * @param injectableType Specifies the type of injectable, either register.injectableType.SINGLE or
        * register.injectableType.MULTI (defaults to register.injectableType.SINGLE).
        *
        * @see register.injectableType
        *
        * @example register.injectable('$CacheStatic', [plat.expressions.Parser], Cache);
        * @example register.injectable('database', MyDatabase, null, register.injectableType.MULTI);
        */
        function injectable(name: string, Type: new(...args: any[]) => void, dependencies?: any[], injectableType?: string): typeof register;
        /**
        * Registers an injectable with the framework. Injectables are objects that can be used for dependency injection into other objects.
        * The dependencies array corresponds to injectables that will be passed into the injectable method.
        *
        * @param name The name of the injector, used when another component is specifying dependencies.
        * @param dependencies An array of strings representing the dependencies needed for the injectable's injector.
        * @param Type The constructor for the injectable. The injectable will only be instantiated once during the application
        * lifetime.
        * @param injectableType Specifies the type of injectable, either register.injectableType.SINGLE or
        * register.injectableType.MULTI (defaults to register.injectableType.SINGLE).
        *
        * @see register.injectableType
        *
        * @return {register} The object that contains the register methods (for method chaining).
        *
        * @example register.injectable('$CacheStatic', [plat.expressions.Parser],
        *  export function(parser? plat.expressions.IParser) { return { ... }; });
        * @example register.injectable('database', export function() { return new Database(); }, null, register.injectableType.MULTI);
        */
        function injectable(name: string, method: (...args: any[]) => any, dependencies?: any[], injectableType?: string): typeof register;
        /**
        * Defines the different types of injectables.
        */
        var injectableType: {
            STATIC: string;
            SINGLE: string;
            MULTI: string;
        };
    }
    module dependency {
        /**
        * The Injector class is used for dependency injection. You can create an injector object,
        * specify dependencies and a constructor for your component. When the injector object is
        * 'injected' it will create a new instance of your component and pass in the dependencies
        * to the constructor.
        */
        class Injector<T> implements IInjector<T> {
            private __name;
            public Constructor: new() => T;
            public type: string;
            /**
            * Initializes all static injectors.
            */
            static initialize(): void;
            /**
            * Gathers and returns the array of listed dependencies.
            *
            * @param dependencies The array of dependencies specified
            * by either their Constructor or their registered name.
            */
            static getDependencies(dependencies: any[]): any[];
            /**
            * Converts dependencies specified by their Constructors into
            * equivalent dependencies specified by their registered string
            * name.
            *
            * @param dependencies The array of dependencies specified
            * by either their Constructor or their registered name.
            */
            static convertDependencies(dependencies: any[]): string[];
            private static __getInjectorName(dependency);
            private static __construct(Constructor, args, pattern);
            private static __locateInjector(Constructor);
            private static __wrap(value);
            private static __noop();
            private static __isInjector(dependency);
            private __dependencies;
            /**
            * @param __name The name of the injected type.
            * @param dependencies An array of strings specifying the injectable dependencies for the
            * associated constructor.
            * @param Constructor The constructor method for the component requiring the dependency
            * injection.
            * @param type The type of injector, used for injectables specifying a register.injectableType of
            * STATIC, SINGLE, or MULTI. The default is SINGLE.
            */
            constructor(__name: string, Constructor: new() => T, dependencies?: any[], type?: string);
            /**
            * Gathers the dependencies for the Injector object and creates a new instance of the
            * Constructor, passing in the dependencies in the order they were specified. If the
            * Injector contains a Constructor for an injectable and the Constructor is registered
            * as a SINGLE type it will only inject that injectable once.
            */
            public inject(): T;
            /**
            * Wraps the injector with the instantiated value in the case of a
            * SINGLE or STATIC type so that it does not re-instantiate.
            */
            public _wrapInjector(value: any): IInjector<any>;
        }
        /**
        * An object whose values are all IInjectors.
        */
        interface IInjectorObject<T> extends IObject<IInjector<T>> {
        }
        /**
        * Describes an object that handles dependency-injection for a Constructor.
        */
        interface IInjector<T> {
            /**
            * Gathers the dependencies for the IInjector object and creates a new instance of the
            * Constructor, passing in the dependencies in the order they were specified. If the
            * Injector contains a Constructor for an injectable it will only inject that injectable
            * once.
            */
            inject(): T;
            /**
            * The constructor method for the component requiring the dependency injection.
            */
            Constructor: new() => T;
            /**
            * The type of injector, used for injectables specifying a register.injectableType of
            * STATIC, SINGLE, or MULTI. The default is SINGLE.
            */
            type?: string;
        }
    }
    /**
    * Returns the requested injectable dependency.
    *
    * @param dependency The dependency Type to return.
    * @param {any} The requested dependency.
    */
    function acquire(dependency: Function): any;
    /**
    * Returns the requested injectable dependency.
    *
    * @param dependency An array of Types specifying the injectable dependencies.
    * @return {Array<any>} The dependencies, in the order they were requested.
    */
    function acquire(dependencies: Function[]): any[];
    /**
    * Returns the requested injectable dependency.
    *
    * @param dependency The injectable dependency type to return.
    * @param {any} The requested dependency.
    */
    function acquire(dependency: string): any;
    /**
    * Gathers dependencies and returns them as an array in the order they were requested.
    *
    * @param dependencies An array of strings specifying the injectable dependencies.
    * @return {Array<any>} The dependencies, in the order they were requested.
    */
    function acquire(dependencies: string[]): any[];
    /**
    * Returns the requested dependency or gathers dependencies and passes them back
    * as an array in the order they were specified.
    */
    interface IAcquire {
        /**
        * Returns the requested injectable dependency.
        *
        * @param dependency The dependency Type to return.
        * @param {any} The requested dependency.
        */
        (dependency: Function): any;
        /**
        * Returns the requested injectable dependency.
        *
        * @param dependency An array of Types specifying the injectable dependencies.
        * @return {Array<any>} The dependencies, in the order they were requested.
        */
        (dependencies: Function[]): any[];
        /**
        * Returns the requested injectable dependency.
        *
        * @param dependency The injectable dependency type to return.
        * @param {any} The requested dependency.
        */
        (dependency: string): any;
        /**
        * Gathers dependencies and returns them as an array in the order they were requested.
        *
        * @param dependencies An array of strings specifying the injectable dependencies.
        * @return {Array<any>} The dependencies, in the order they were requested.
        */
        (dependencies: string[]): any[];
    }
    /**
    * Manages the throwing and consuming of errors and warnings.
    */
    class Exception {
        /**
        * Method for sending a warning to all listeners. Will
        * not throw an error.
        *
        * @param message The message to be sent to the listeners.
        * @param type Denotes the type of fatal exception.
        */
        static warn(message: string, type?: number): void;
        /**
        * Method for sending a fatal error to all listeners. Will
        * throw an error.
        *
        * @param error The Error to be sent to all the listeners.
        * @param type Denotes the type of fatal exception.
        */
        static fatal(error: Error, type?: number): any;
        /**
        * Method for sending a fatal message to all listeners. Will
        * throw an error.
        *
        * @param message The message to be sent to all the listeners.
        * @param type Denotes the type of fatal exception.
        */
        static fatal(message: string, type?: number): any;
        /**
        * Exception Type
        */
        static PARSE: number;
        /**
        * Exception Type
        */
        static COMPILE: number;
        /**
        * Exception Type
        */
        static BIND: number;
        /**
        * Exception Type
        */
        static NAME: number;
        /**
        * Exception Type
        */
        static NAVIGATION: number;
        /**
        * Exception Type
        */
        static TEMPLATE: number;
        /**
        * Exception Type
        */
        static AJAX: number;
        /**
        * Exception Type
        */
        static CONTEXT: number;
        /**
        * Exception Type
        */
        static EVENT: number;
        /**
        * Exception Type
        */
        static INJECTABLE: number;
        /**
        * Exception Type
        */
        static COMPAT: number;
        /**
        * Exception Type
        */
        static PROMISE: number;
    }
    /**
    * The intended external interface for the '$ExceptionStatic' injectable.
    */
    interface IExceptionStatic {
        /**
        * Method for sending a warning to all listeners. Will
        * not throw an error.
        *
        * @param message The message to be sent to the listeners.
        * @param type Denotes the type of fatal exception.
        */
        warn(message: string, type?: number): void;
        /**
        * Method for sending a fatal error to all listeners. Will
        * throw an error.
        *
        * @param error The Error to be sent to all the listeners.
        * @param type Denotes the type of fatal exception.
        */
        fatal(error: Error, type?: number): void;
        /**
        * Method for sending a fatal message to all listeners. Will
        * throw an error.
        *
        * @param message The message to be sent to all the listeners.
        * @param type Denotes the type of fatal exception.
        */
        fatal(message: string, type?: number): void;
        /**
        * Exception Type
        */
        PARSE: number;
        /**
        * Exception Type
        */
        COMPILE: number;
        /**
        * Exception Type
        */
        BIND: number;
        /**
        * Exception Type
        */
        NAME: number;
        /**
        * Exception Type
        */
        NAVIGATION: number;
        /**
        * Exception Type
        */
        TEMPLATE: number;
        /**
        * Exception Type
        */
        AJAX: number;
        /**
        * Exception Type
        */
        CONTEXT: number;
        /**
        * Exception Type
        */
        EVENT: number;
        /**
        * Exception Type
        */
        INJECTABLE: number;
        /**
        * Exception Type
        */
        COMPAT: number;
        /**
        * Exception Type
        */
        PROMISE: number;
    }
    /**
    * The Type for referencing the '$ExceptionStatic' injectable as a dependency.
    */
    function ExceptionStatic(): typeof Exception;
    /**
    * A class for checking browser compatibility issues.
    */
    class Compat implements ICompat {
        /**
        * Signifies whether or not Cordova is defined. If it is,
        * we hook up ALM events to Cordova's functions.
        */
        public cordova: boolean;
        /**
        * Signifies whether window.history.pushState is defined.
        */
        public pushState: boolean;
        /**
        * Signifies whether Require is present. If it is, we assume
        * it is going to be used and leave the loading of the app up
        * to the developer.
        */
        public amd: boolean;
        /**
        * Signifies whether we are in the contet of a Windows 8 app.
        */
        public msApp: boolean;
        /**
        * Signifies whether indexedDB exists on the window.
        */
        public indexedDb: boolean;
        /**
        * Signifies whether Object.prototype.__proto__ exists.
        */
        public proto: boolean;
        /**
        * Signifies whether Object.prototype.getPrototypeOf exists.
        */
        public getProto: boolean;
        /**
        * Signifies whether Object.prototype.setPrototypeOf exists.
        */
        public setProto: boolean;
        /**
        * Determines if the browser is modern enough to correctly
        * run PlatypusTS.
        */
        public isCompatible : boolean;
        constructor();
    }
    /**
    * An object containing boolean values signifying browser
    * and/or platform compatibilities.
    */
    interface ICompat {
        /**
        * Signifies whether or not Cordova is defined. If it is,
        * we hook up ALM events to Cordova's functions.
        */
        cordova: boolean;
        /**
        * Signifies whether window.history.pushState is defined.
        */
        pushState: boolean;
        /**
        * Signifies whether Require is present. If it is, we assume
        * it is going to be used and leave the loading of the app up
        * to the developer.
        */
        amd: boolean;
        /**
        * Signifies whether we are in the contet of a Windows 8 app.
        */
        msApp: boolean;
        /**
        * Signifies whether indexedDB exists on the window.
        */
        indexedDb: boolean;
        /**
        * Signifies whether Object.prototype.__proto__ exists.
        */
        proto: boolean;
        /**
        * Signifies whether Object.prototype.getPrototypeOf exists.
        */
        getProto: boolean;
        /**
        * Signifies whether Object.prototype.setPrototypeOf exists.
        */
        setProto: boolean;
        /**
        * Determines if the browser is modern enough to correctly
        * run PlatypusTS.
        */
        isCompatible: boolean;
    }
    /**
    * An extensible class defining common utilities and helper functions.
    */
    class Utils implements IUtils {
        /**
        * An empty method for quickly creating dummy objects.
        */
        public noop(): void;
        /**
        * Allows you to extend the properties of an object with any number
        * of other objects. If objects share properties, the last object in the
        * arguments will take precedence. This method is only a shallow copy of
        * all the source objects to the destination object.
        *
        * @param destination The destination object to extend.
        * @param ...sources[] Any number of objects with which to extend the
        * destination object.
        *
        * @return {any} The extended destination object.
        */
        public extend(destination: any, ...sources: any[]): any;
        /**
        * Allows you to extend the properties of an object with any number
        * of other objects. If objects share properties, the last object in the
        * arguments will take precedence. This method is a deep copy of
        * all the source objects to the destination object.
        *
        * @param destination The destination object to extend.
        * @param ...sources[] Any number of objects with which to extend the
        * destination object.
        *
        * @return {any} The extended destination object.
        */
        public deepExtend(destination: any, ...sources: any[]): any;
        /**
        * Takes in anything and determines if it is a type of Object.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is an object, false otherwise.
        */
        public isObject(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a window object.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is the window, false otherwise.
        */
        public isWindow(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a document object.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is the document, false otherwise.
        */
        public isDocument(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a Node.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a Node, false otherwise.
        */
        public isNode(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a string.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a string, false otherwise.
        */
        public isString(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a RegExp object.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a RegExp object, false otherwise.
        */
        public isRegExp(obj: any): boolean;
        /**
        * Takes in anything and determines if it is empty. Useful for
        * checking for empty strings, arrays, or objects without keys.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if the object isEmpty (or null/undefined),
        * false otherwise.
        */
        public isEmpty(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a boolean.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a boolean, false otherwise.
        */
        public isBoolean(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a number.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a number, false otherwise.
        */
        public isNumber(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a function.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a function, false otherwise.
        */
        public isFunction(obj: any): boolean;
        /**
        * Takes in anything and determines if it is null or undefined.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is null or undefined, false otherwise.
        */
        public isNull(obj: any): boolean;
        /**
        * Takes in anything and determines if it is undefined.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is undefined, false otherwise.
        */
        public isUndefined(obj: any): boolean;
        /**
        * Takes in anything and determines if it is an Array.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is an Array, false otherwise.
        */
        public isArray(obj: any): boolean;
        /**
        * Takes in anything and determines if it has array-like qualities.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj has array-like qualities (i.e. it is an
        * Array, string, arguments, or NodeList), false otherwise.
        */
        public isArrayLike(obj: any): boolean;
        /**
        * Takes in an array and a function to evaluate the properties in the array.
        * Returns a filtered array of objects resulting from evaluating the function.
        *
        * @param array The Array to filter.
        * @param iterator The iterator function to call with array's properties. Returns true if the property
        * should be kept, false otherwise.
        * @param context Optional context with which to call the iterator.
        *
        * @return {Array<T>} An array of objects which evaluated to true with the iterator.
        */
        public filter<T>(array: T[], iterator: (value: T, key: any, obj: any) => boolean, context?: any): T[];
        /**
        * Takes in an object/array and a function to evaluate the properties in the object/array.
        * Returns a filtered array of objects resulting from evaluating the function.
        *
        * @param obj The object to filter.
        * @param iterator The iterator function to call with obj's properties. Returns true if the property
        * should be kept, false otherwise.
        * @param context Optional context with which to call the iterator.
        *
        * @return {Array<T>} An array of objects which evaluated to true with the iterator.
        */
        public filter<T>(obj: any, iterator: (value: T, key: any, obj: any) => boolean, context?: any): T[];
        /**
        * Takes in a list and object containing key/value pairs to search for in the list.
        *
        * @param array The list used for searching for properties.
        * @param properties An object containing key/value pairs to match with obj's values.
        *
        * @return {Array<T>} The matched values in obj.
        *
        * @example where([{foo: 'foo', bar: 'bar'}, {foo: 'bar', bar: 'foo'}], {foo: 'foo'});
        * //returns [{foo: 'bar', bar: 'bar'}]
        */
        public where<T>(array: T[], properties: any): T[];
        /**
        * Takes in a list and object containing key/value pairs to search for on the obj.
        *
        * @param obj The list used for searching for properties.
        * @param properties An object containing key/value pairs to match with obj's values.
        *
        * @return {Array<T>} The matched values in obj.
        *
        * @example where([{foo: 'foo', bar: 'bar'}, {foo: 'bar', bar: 'foo'}], {foo: 'foo'});
        * //returns [{foo: 'bar', bar: 'bar'}]
        */
        public where<T>(obj: any, properties: any): T[];
        /**
        * Takes in an Array and a function to iterate over. Calls the iterator function with every property
        * in the Array, then returns the object.
        *
        * @param obj An Array.
        * @param iterator A method that takes in a value, index, and the object.
        * @param context An optional context to bind to the iterator.
        *
        * @return {Array<T>} The array.
        */
        public forEach<T>(array: T[], iterator: (value: T, index: number, obj: any) => void, context?: any): T[];
        /**
        * Takes in an object and a function to iterate over. Calls the iterator function with every property
        * in the object, then returns the object. If the object is Array-like (e.g. a String), it will be treated as though
        * it is an Array.
        *
        * @param obj An object.
        * @param iterator A method that takes in a value, key, and the object.
        * @param context An optional context to bind to the iterator.
        *
        * @return {IObject<T>} The object.
        */
        public forEach<T>(obj: any, iterator: (value: T, key: string, obj: any) => void, context?: any): any;
        /**
        * Takes in an object and an iterator function. Calls the iterator with all the values in the object. The
        * iterator can transform the object and return it. The returned values will be pushed to an Array and
        * returned.
        *
        * @param array An Array.
        * @param iterator The transformation function.
        * @param context An optional context to bind to the iterator.
        *
        * @return {Array<U>} The accumulated transformed values from the iterator.
        */
        public map<T, U>(array: T[], iterator: (value: T, index: number, obj: any) => U, context?: any): U[];
        /**
        * Takes in an object and an iterator function. Calls the iterator with all the values in the object. The
        * iterator can transform the object and return it. The returned values will be pushed to an Array and
        * returned.
        *
        * @param obj An object/array.
        * @param iterator The transformation function.
        * @param context An optional context to bind to the iterator.
        *
        * @return {Array<U>} The accumulated transformed values from the iterator.
        */
        public map<T, U>(obj: any, iterator: (value: T, key: string, obj: any) => U, context?: any): U[];
        /**
        * Takes in an object and a property to extract from all of the object's values. Returns an array of
        * the 'plucked' values.
        *
        * @param obj An object.
        * @param key The property to 'pluck' from each value in obj.
        *
        * @return {Array<U>} An array of 'plucked' values from obj.
        */
        public pluck<T, U>(obj: any, key: string): U[];
        /**
        * Takes in an array and an iterator. Evaluates all the values in the array with the iterator.
        * Returns true if any of the iterators return true, otherwise returns false.
        *
        * @param array An array.
        * @param iterator A method with which to evaluate all the values in obj.
        * @param context An optional context to bind to the iterator.
        *
        * @return {boolean} True if any calls to iterator return true, false otherwise.
        */
        public some<T>(array: T[], iterator: (value: T, index: number, obj: any) => boolean, context?: any): boolean;
        /**
        * Takes in an object and an iterator. Evaluates all the values in the object with the iterator.
        * Returns true if any of the iterators return true, otherwise returns false. If the object is Array-like
        * (e.g. a String), it will be treated as though it is an Array.
        *
        * @param obj An object.
        * @param iterator A method with which to evaluate all the values in obj.
        * @param context An optional context to bind to the iterator.
        *
        * @return {boolean} True if any calls to iterator return true, false otherwise.
        */
        public some<T>(obj: any, iterator: (value: T, key: string, obj: any) => boolean, context?: any): boolean;
        /**
        * Takes in a method and array of arguments to pass to that method. Delays calling the method until
        * after the current call stack is clear. Equivalent to a setTimeout with a timeout of 0.
        *
        * @param method The method to call.
        * @param args The arguments to apply to the method.
        * @param context An optional context to bind to the method.
        *
        * @return {() => void} A function that will clear the timeout when called.
        */
        public postpone(method: (...args: any[]) => void, args?: any[], context?: any): () => void;
        /**
        * Takes in a method and array of arguments to pass to that method. Delays calling the method until
        * after the current call stack is clear. Equivalent to a setTimeout with a timeout of 0.
        *
        * @param method The method to call.
        * @param timeout The time (in milliseconds) to delay before calling the provided method
        * @param args The arguments to apply to the method.
        * @param context An optional context to bind to the method.
        *
        * @return {() => void} A function that will clear the timeout when called.
        */
        public defer(method: (...args: any[]) => void, timeout: number, args?: any[], context?: any): () => void;
        /**
        * Takes in a prefix and returns a unique identifier string with the prefix preprended. If no prefix
        * is specified, none will be prepended.
        *
        * @param prefix A string prefix to prepend tothe unique ID.
        *
        * @return {string} The prefix-prepended unique id.
        */
        public uniqueId(prefix?: string): string;
        /**
        * Takes in a spinal-case, dot.case, or snake_case string and returns
        * a camelCase string. Also can turn a string into camelCase with space
        * as a delimeter.
        *
        * @param str The spinal-case, dot.case, or snake_case string
        *
        * @return {string} The camelCase string
        *
        * @example camelCase('plat-options'); // returns 'platOptions'
        */
        public camelCase(str: string): string;
    }
    /**
    * An object defining common utilities and helper functions.
    */
    interface IUtils {
        /**
        * An empty method for quickly creating dummy objects.
        */
        noop(): void;
        /**
        * Allows you to extend the properties of an object with any number
        * of other objects. If objects share properties, the last object in the
        * arguments will take precedence. This method is only a shallow copy of
        * all the source objects to the destination object.
        *
        * @param destination The destination object to extend.
        * @param ...sources[] Any number of objects with which to extend the
        * destination object.
        *
        * @return {any} The extended destination object.
        */
        extend(destination: any, ...sources: any[]): any;
        /**
        * Allows you to extend the properties of an object with any number
        * of other objects. If objects share properties, the last object in the
        * arguments will take precedence. This method is a deep copy of
        * all the source objects to the destination object.
        *
        * @param destination The destination object to extend.
        * @param ...sources[] Any number of objects with which to extend the
        * destination object.
        *
        * @return {any} The extended destination object.
        */
        deepExtend(destination: any, ...sources: any[]): any;
        /**
        * Takes in anything and determines if it is a type of Object.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is an object, false otherwise.
        */
        isObject(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a window object.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is the window, false otherwise.
        */
        isWindow(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a document object.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is the document, false otherwise.
        */
        isDocument(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a Node.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a Node, false otherwise.
        */
        isNode(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a string.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a string, false otherwise.
        */
        isString(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a RegExp object.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a RegExp object, false otherwise.
        */
        isRegExp(obj: any): boolean;
        /**
        * Takes in anything and determines if it is empty. Useful for
        * checking for empty strings, arrays, or objects without keys.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if the object isEmpty (or null/undefined),
        * false otherwise.
        */
        isEmpty(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a boolean.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a boolean, false otherwise.
        */
        isBoolean(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a number.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a number, false otherwise.
        */
        isNumber(obj: any): boolean;
        /**
        * Takes in anything and determines if it is a function.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is a function, false otherwise.
        */
        isFunction(obj: any): boolean;
        /**
        * Takes in anything and determines if it is null or undefined.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is null or undefined, false otherwise.
        */
        isNull(obj: any): boolean;
        /**
        * Takes in anything and determines if it is undefined.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is undefined, false otherwise.
        */
        isUndefined(obj: any): boolean;
        /**
        * Takes in anything and determines if it is an Array.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj is an Array, false otherwise.
        */
        isArray(obj: any): boolean;
        /**
        * Takes in anything and determines if it has array-like qualities.
        *
        * @param obj Anything.
        *
        * @return {boolean} True if obj has array-like qualities (i.e. it is an
        * Array, string, arguments, or NodeList), false otherwise.
        */
        isArrayLike(obj: any): boolean;
        /**
        * Takes in an array and a function to evaluate the properties in the array.
        * Returns a filtered array of objects resulting from evaluating the function.
        *
        * @param array The Array to filter.
        * @param iterator The iterator function to call with array's properties. Returns true if the property
        * should be kept, false otherwise.
        * @param context Optional context with which to call the iterator.
        *
        * @return {Array<T>} An array of objects which evaluated to true with the iterator.
        */
        filter<T>(array: T[], iterator: (value: T, key: any, obj: any) => boolean, context?: any): T[];
        /**
        * Takes in an object/array and a function to evaluate the properties in the object/array.
        * Returns a filtered array of objects resulting from evaluating the function.
        *
        * @param obj The object to filter.
        * @param iterator The iterator function to call with obj's properties. Returns true if the property
        * should be kept, false otherwise.
        * @param context Optional context with which to call the iterator.
        *
        * @return {Array<T>} An array of objects which evaluated to true with the iterator.
        */
        filter<T>(obj: any, iterator: (value: T, key: any, obj: any) => boolean, context?: any): T[];
        /**
        * Takes in a list and object containing key/value pairs to search for in the list.
        *
        * @param array The list used for searching for properties.
        * @param properties An object containing key/value pairs to match with obj's values.
        *
        * @return {Array<T>} The matched values in obj.
        *
        * @example where([{foo: 'foo', bar: 'bar'}, {foo: 'bar', bar: 'foo'}], {foo: 'foo'});
        * //returns [{foo: 'bar', bar: 'bar'}]
        */
        where<T>(array: T[], properties: any): T[];
        /**
        * Takes in a list and object containing key/value pairs to search for on the obj.
        *
        * @param obj The list used for searching for properties.
        * @param properties An object containing key/value pairs to match with obj's values.
        *
        * @return {Array<T>} The matched values in obj.
        *
        * @example where([{foo: 'foo', bar: 'bar'}, {foo: 'bar', bar: 'foo'}], {foo: 'foo'});
        * //returns [{foo: 'bar', bar: 'bar'}]
        */
        where<T>(obj: any, properties: any): T[];
        /**
        * Takes in an Array and a function to iterate over. Calls the iterator function with every property
        * in the Array, then returns the object.
        *
        * @param obj An Array.
        * @param iterator A method that takes in a value, index, and the object.
        * @param context An optional context to bind to the iterator.
        *
        * @return {Array<T>} The array.
        */
        forEach<T>(array: T[], iterator: (value: T, index: number, obj: any) => void, context?: any): T[];
        /**
        * Takes in an object and a function to iterate over. Calls the iterator function with every property
        * in the object, then returns the object. If the object is Array-like (e.g. a String), it will be treated as though
        * it is an Array.
        *
        * @param obj An object.
        * @param iterator A method that takes in a value, key, and the object.
        * @param context An optional context to bind to the iterator.
        *
        * @return {IObject<T>} The object.
        */
        forEach<T>(obj: any, iterator: (value: T, key: string, obj: any) => void, context?: any): any;
        /**
        * Takes in an object and an iterator function. Calls the iterator with all the values in the object. The
        * iterator can transform the object and return it. The returned values will be pushed to an Array and
        * returned.
        *
        * @param array An Array.
        * @param iterator The transformation function.
        * @param context An optional context to bind to the iterator.
        *
        * @return {Array<U>} The accumulated transformed values from the iterator.
        */
        map<T, U>(array: T[], iterator: (value: T, index: number, obj: any) => U, context?: any): U[];
        /**
        * Takes in an object and an iterator function. Calls the iterator with all the values in the object. The
        * iterator can transform the object and return it. The returned values will be pushed to an Array and
        * returned.
        *
        * @param obj An object/array.
        * @param iterator The transformation function.
        * @param context An optional context to bind to the iterator.
        *
        * @return {Array<U>} The accumulated transformed values from the iterator.
        */
        map<T, U>(obj: any, iterator: (value: T, key: string, obj: any) => U, context?: any): U[];
        /**
        * Takes in an object and a property to extract from all of the object's values. Returns an array of
        * the 'plucked' values.
        *
        * @param obj An object.
        * @param key The property to 'pluck' from each value in obj.
        *
        * @return {Array<U>} An array of 'plucked' values from obj.
        */
        pluck<T, U>(obj: any, key: string): U[];
        /**
        * Takes in an array and an iterator. Evaluates all the values in the array with the iterator.
        * Returns true if any of the iterators return true, otherwise returns false.
        *
        * @param array An array.
        * @param iterator A method with which to evaluate all the values in obj.
        * @param context An optional context to bind to the iterator.
        *
        * @return {boolean} True if any calls to iterator return true, false otherwise.
        */
        some<T>(array: T[], iterator: (value: T, index: number, obj: any) => boolean, context?: any): boolean;
        /**
        * Takes in an object and an iterator. Evaluates all the values in the object with the iterator.
        * Returns true if any of the iterators return true, otherwise returns false. If the object is Array-like
        * (e.g. a String), it will be treated as though it is an Array.
        *
        * @param obj An object.
        * @param iterator A method with which to evaluate all the values in obj.
        * @param context An optional context to bind to the iterator.
        *
        * @return {boolean} True if any calls to iterator return true, false otherwise.
        */
        some<T>(obj: any, iterator: (value: T, key: string, obj: any) => boolean, context?: any): boolean;
        /**
        * Takes in a method and array of arguments to pass to that method. Delays calling the method until
        * after the current call stack is clear. Equivalent to a setTimeout with a timeout of 0.
        *
        * @param method The method to call.
        * @param args The arguments to apply to the method.
        * @param context An optional context to bind to the method.
        *
        * @return {() => void} A function that will clear the timeout when called.
        */
        postpone(method: (...args: any[]) => void, args?: any[], context?: any): () => void;
        /**
        * Takes in a method and array of arguments to pass to that method. Delays calling the method until
        * after the current call stack is clear. Equivalent to a setTimeout with a timeout of 0.
        *
        * @param method The method to call.
        * @param timeout The time (in milliseconds) to delay before calling the provided method
        * @param args The arguments to apply to the method.
        * @param context An optional context to bind to the method.
        *
        * @return {() => void} A function that will clear the timeout when called.
        */
        defer(method: (...args: any[]) => void, timeout: number, args?: any[], context?: any): () => void;
        /**
        * Takes in a prefix and returns a unique identifier string with the prefix preprended. If no prefix
        * is specified, none will be prepended.
        *
        * @param prefix A string prefix to prepend tothe unique ID.
        *
        * @return {string} The prefix-prepended unique id.
        */
        uniqueId(prefix?: string): string;
        /**
        * Takes in a spinal-case, dot.case, or snake_case string and returns
        * a camelCase string. Also can turn a string into camelCase with space
        * as a delimeter.
        *
        * @param str The spinal-case, dot.case, or snake_case string
        *
        * @return {string} The camelCase string
        *
        * @example camelCase('plat-options'); // returns 'platOptions'
        */
        camelCase(str: string): string;
    }
    /**
    * The Type for referencing the '$window' injectable as a dependency.
    * Used so that the Window can be mocked.
    */
    function WindowStatic(): Window;
    /**
    * The Type for referencing the '$document' injectable as a dependency.
    * Used so that the Window can be mocked.
    */
    function DocumentStatic(window: Window): Document;
    module expressions {
        /**
        * A class for keeping track of commonly used regular expressions.
        */
        class Regex implements IRegex {
            /**
            * The regular expression for matching or removing all newline characters.
            */
            public newLineRegex : RegExp;
            /**
            * The regular expression for finding markup in a string.
            */
            public markupRegex : RegExp;
            /**
            * Finds the arguments in a method expression
            *
            * @example
            *   // outputs ["('foo', 'bar', 'baz')", "'foo', 'bar', 'baz'"]
            *   exec("myFunction('foo', 'bar', 'baz')");
            */
            public argumentRegex : RegExp;
            /**
            * Given a string, finds the root alias name if that string is an
            * alias path.
            *
            * @example
            *   // outputs ['context']
            *   exec('@context.foo');
            *
            * @example
            *   // outputs null
            *   exec('@context');
            */
            public aliasRegex : RegExp;
            /**
            * Finds optional parameters in a route string.
            *
            * @example
            *   // outputs ['(/foo)', '/foo']
            *   exec('(/foo)/bar');
            *
            * @example
            *  // outputs ['(/foo)', '/foo']
            *  exec('(/foo))');
            */
            public optionalRouteRegex : RegExp;
            /**
            * Finds named parameters in a route string.
            *
            * @example
            *   // outputs [':foo']
            *   exec('/:foo/bar')
            *
            *   // outputs [':foo']
            *   exec('(/:foo)/bar');
            */
            public namedParameterRouteRegex : RegExp;
            /**
            * Finds an alphanumeric wildcard match in a route string.
            *
            * @example
            *   // outputs ['*bar']
            *   exec('/foo/*bar/baz')
            */
            public wildcardRouteRegex : RegExp;
            /**
            * Finds invalid characters in a route string.
            *
            * @example
            *  // outputs ['?']
            *  exec('/foo/bar?query=baz');
            */
            public escapeRouteRegex : RegExp;
            /**
            * Finds '/*.html' or '/*.htm' in a url. Useful for removing
            * the html file out of the url.
            *
            * @example
            *   // outputs ['/index.html']
            *   exec('http://localhost:8080/index.html');
            */
            public initialUrlRegex : RegExp;
            /**
            * Finds a protocol delimeter in a string (i.e. ://)
            */
            public protocolRegex : RegExp;
            /**
            * Finds delimeters for spinal-case, snake_case, and dot.case.
            * useful for converting to camelCase. Also can turn a string
            * into camelCase with space as a delimeter.
            *
            * @example
            *   // outputs ['-o', '-', 'o']
            *   exec('plat-options')
            *
            * @example
            *   // outputs ['.c', '.', 'c']
            *   exec('plat.config')
            *
            * @example
            *   // outputs ['_v', '_', 'v']
            *   exec('plat_var')
            *
            * @example
            *   // outputs [' W', ' ', 'W']
            *   exec('Hello World')
            */
            public camelCaseRegex : RegExp;
            /**
            * Finds all whitespace and newline characters
            * not in string literals. Needs to be combined
            * with string replace function using $1 argument.
            */
            public whiteSpaceRegex : RegExp;
            /**
            * Finds all single and double quotes.
            */
            public quotationRegex : RegExp;
            /**
            * Looks for any invalid variable syntax.
            */
            public invalidVariableRegex : RegExp;
        }
        /**
        * The intended external interface for the ‘$regex’ injectable.
        */
        interface IRegex {
            /**
            * The regular expression for matching or removing all newline characters.
            */
            newLineRegex: RegExp;
            /**
            * The regular expression for finding markup in a string.
            */
            markupRegex: RegExp;
            /**
            * Finds the arguments in a method expression
            *
            * @example
            *   // outputs ["('foo', 'bar', 'baz')", "'foo', 'bar', 'baz'"]
            *   exec("myFunction('foo', 'bar', 'baz')");
            */
            argumentRegex: RegExp;
            /**
            * Given a string, finds the root alias name if that string is an
            * alias path.
            *
            * @example
            *   // outputs ['context']
            *   exec('@context.foo');
            *
            * @example
            *   // outputs null
            *   exec('@context');
            */
            aliasRegex: RegExp;
            /**
            * Finds optional parameters in a route string.
            *
            * @example
            *   // outputs ['(/foo)', '/foo']
            *   exec('(/foo)/bar');
            *
            * @example
            *  // outputs ['(/foo)', '/foo']
            *  exec('(/foo))');
            */
            optionalRouteRegex: RegExp;
            /**
            * Finds named parameters in a route string.
            *
            * @example
            *   // outputs [':foo']
            *   exec('/:foo/bar')
            *
            *   // outputs [':foo']
            *   exec('(/:foo)/bar');
            */
            namedParameterRouteRegex: RegExp;
            /**
            * Finds an alphanumeric wildcard match in a route string.
            *
            * @example
            *   // outputs ['*bar']
            *   exec('/foo/*bar/baz')
            */
            wildcardRouteRegex: RegExp;
            /**
            * Finds invalid characters in a route string.
            *
            * @example
            *  // outputs ['?']
            *  exec('/foo/bar?query=baz');
            */
            escapeRouteRegex: RegExp;
            /**
            * Finds '/*.html' or '/*.htm' in a url. Useful for removing
            * the html file out of the url.
            *
            * @example
            *   // outputs ['/index.html']
            *   exec('http://localhost:8080/index.html');
            */
            initialUrlRegex: RegExp;
            /**
            * Finds a protocol delimeter in a string (i.e. ://)
            */
            protocolRegex: RegExp;
            /**
            * Finds delimeters for spinal-case, snake_case, and dot.case.
            * useful for converting to camelCase. Also can turn a string
            * into camelCase with space as a delimeter.
            *
            * @example
            *   // outputs ['-o', '-', 'o']
            *   exec('plat-options')
            *
            * @example
            *   // outputs ['.c', '.', 'c']
            *   exec('plat.config')
            *
            * @example
            *   // outputs ['_v', '_', 'v']
            *   exec('plat_var')
            *
            * @example
            *   // outputs [' W', ' ', 'W']
            *   exec('Hello World')
            */
            camelCaseRegex: RegExp;
            /**
            * Finds all whitespace and newline characters
            * not in string literals. Needs to be combined
            * with string replace function using $1 argument.
            */
            whiteSpaceRegex: RegExp;
            /**
            * Finds all single and double quotes.
            */
            quotationRegex: RegExp;
            /**
            * Looks for any invalid variable syntax.
            */
            invalidVariableRegex: RegExp;
        }
        /**
        * Responsible for taking a javascript expression string and
        * finding all its tokens (i.e. delimiters, operators, etc).
        */
        class Tokenizer implements ITokenizer {
            public $ExceptionStatic: IExceptionStatic;
            /**
            * The input string to tokenize.
            */
            public _input: string;
            private __previousChar;
            private __variableRegex;
            private __outputQueue;
            private __operatorStack;
            private __argCount;
            private __objArgCount;
            private __lastColonChar;
            private __lastCommaChar;
            /**
            * Creates an IToken array for the Tokenizer's input string.
            * The IToken array contains all the tokens for the input string.
            *
            * @param input The expression string to tokenize.
            */
            public createTokens(input: string): IToken[];
            private __handleAplhaNumeric(index, char);
            private __handlePeriod(index, char);
            private __handleLeftBrace(char);
            private __handleRightBrace(char);
            private __handleLeftBracket(char);
            private __handleRightBracket(char);
            private __handleLeftParenthesis(char);
            private __handleRightParenthesis(char);
            private __handleComma(char);
            private __handleStringLiteral(index, char);
            private __handleQuestion(char);
            private __handleColon(char, ternary);
            private __handleOtherOperator(index, char);
            private __popRemainingOperators();
            private __determineOperator(operator);
            private __determinePrecedence(operator);
            private __removeFnFromStack(argCount);
            /**
            * Determines character type
            *
            * @param char The character to check
            * @param isNumberLike Whether or not the character resembles a number
            */
            public _checkType(char: string, isNumberLike: boolean): boolean;
            /**
            * Looks ahead in the expression to group similar character types.
            *
            * @param index The current index in the expression string
            * @param isNumberLike Whether or not the character resembles a number
            * @param array A temporary array used to aggregate similar character types.
            * @return {number} The new index in the expression string
            */
            public _lookAhead(index: number, isNumberLike: boolean, array: string[]): number;
            /**
            * Looks ahead in the expression to try and complete the
            * current operator.
            *
            * @param char The operator to find
            * @param index The current index in the expression string
            */
            public _lookAheadForOperatorFn(char: string, index: number): ILookAheadResult;
            /**
            * Looks ahead in the expression until it comes to the ending
            * character to try and complete a particular sequence
            * (i.e. - a string literal).
            *
            * @param char The starting character
            * @param endChar The ending character
            * @param index The current index in the expression string
            * @param includeDelimiter Whether or not to include the delimiter
            * in the result
            */
            public _lookAheadForDelimiter(char: string, endChar: string, index: number, includeDelimiter?: boolean): ILookAheadResult;
            /**
            * Pops the operator stack onto the output queue until a particular
            * operator value is reached.
            *
            * @param topOperator The top of the operator stack
            * @param char The operator value being searched for
            * @param error The error to throw in the case that the expression
            * is invalid.
            */
            public _popStackForVal(topOperator: any, char: string, error: string): void;
            /**
            * Check if the 'val' property is equal to a particular character.
            *
            * @param obj The obj whose 'val' property to compare
            * @param char The char to compare with
            */
            public _isValEqual(obj: any, char: string): boolean;
            /**
            * Check if the 'val' property is not equal to a particular character.
            *
            * @param obj The obj whose 'val' property to compare
            * @param char The char to compare with
            */
            public _isValUnequal(obj: any, char: string): boolean;
            /**
            * Reset the tokenizer's properties.
            */
            public _resetTokenizer(): void;
            /**
            * Throw an exception in the case of an error.
            *
            * @param error The error message to throw
            */
            public _throwError(error: string): void;
            /**
            * Checks if a single character is numeric.
            *
            * @param char The character to check.
            */
            public _isNumeric(char: string): boolean;
            /**
            * Checks if a single character is a space.
            *
            * @param char The character to check.
            */
            public _isSpace(char: string): boolean;
            /**
            * Checks if a single character is an alphabetical
            * type character.
            *
            * @param char The character to check.
            */
            public _isAlpha(char: string): boolean;
            /**
            * Checks if a single character is alphanumeric.
            *
            * @param char The character to check.
            */
            public _isAlphaNumeric(char: string): boolean;
            /**
            * Checks if a string has proper javascript variable syntax.
            *
            * @param input The string to check.
            */
            public _isStringValidVariable(input: string): boolean;
        }
        /**
        * Describes a token in an expression.
        */
        interface IToken {
            /**
            * The string or number value of the token.
            */
            val: any;
            /**
            * Denotes the type of token, as well as the number
            * of arguments for a function if it is the token.
            *
            * If -2: Denotes a function name unless indexed into with [].
            * If -1: Denotes a variable or empty array literal.
            * If 0: Denotes a number, keyword, object indexer (.[]), string literal,
            *  function with 0 arguments, ternary expression, or empty object literal
            * If 1: Denotes a function type with 1 argument, a property on an object literal,
            *  an object literal with 1 property, or an array literal with 1 entry.
            * If > 1: Denotes a function type with args arguments, an object literal with
            *  args properties, or an array literal with args entries.
            */
            args: number;
        }
        /**
        * Provides all the necessary details on how to evaluate a token.
        */
        interface ITokenDetails {
            /**
            * The precedence that this token takes with respect to the
            * evaluation order.
            */
            precedence: number;
            /**
            * Whether or not the token associates with the expression on
            * their left or right.
            */
            associativity: string;
            /**
            * A function used to evaluate an operator expression.
            */
            fn: Function;
        }
        /**
        * An object describing the result of looking ahead in the expression.
        */
        interface ILookAheadResult {
            /**
            * The resultant string after after looking ahead
            */
            char: string;
            /**
            * The new current index in the expression string
            */
            index: number;
        }
        /**
        * Describes an object used to find tokens for an expression and create ITokens.
        */
        interface ITokenizer {
            /**
            * Takes in an expression string and outputs ITokens.
            *
            * @param input The expression string to tokenize.
            */
            createTokens(input: string): IToken[];
        }
        /**
        * Parses javascript expression strings and creates IParsedExpressions.
        */
        class Parser implements IParser {
            /**
            * A single expression's token representation created by the Tokenizer.
            */
            public _tokens: IToken[];
            public $tokenizer: ITokenizer;
            public $ExceptionStatic: IExceptionStatic;
            private __cache;
            private __codeArray;
            private __identifiers;
            private __tempIdentifiers;
            private __aliases;
            private __uniqueAliases;
            /**
            * Parses a string representation of a javascript expression and turns it
            * into an IParsedExpression.
            *
            * @param input The string representation of a javascript expression.
            */
            public parse(input: string): IParsedExpression;
            /**
            * Evaluate the current token array.
            *
            * @param input The input string to evaluate.
            */
            public _evaluate(input: string): IParsedExpression;
            private __convertPrimitive(index, token, args);
            private __convertFunction(index, token, useLocalContext);
            private __convertObject(args);
            private __convertArrayLiteral(args);
            private __handleFunction(index, args, useLocalContext);
            private __indexIntoObject(index, useLocalContext);
            private __handleQuestion();
            private __handleColon();
            private __handleOperator(token, args);
            private __findInitialContext(context, aliases, token, undefined?);
            private __indexIntoContext(context, token, undefined?);
            /**
            * Peek at the next token.
            *
            * @param index The current index.
            */
            public _peek(index: number): IToken;
            /**
            * Evaluate and remove the leftover identifiers.
            */
            public _popRemainingIdentifiers(): void;
            /**
            * Remove duplicate identifiers.
            */
            public _makeIdentifiersUnique(): void;
            /**
            * Check if the 'val' property is equal to a particular character.
            *
            * @param obj The obj whose 'val' property to compare
            * @param char The char to compare with
            */
            public _isValEqual(obj: any, char: string): boolean;
            /**
            * Check if the 'val' property is not equal to a particular character.
            *
            * @param obj The obj whose 'val' property to compare
            * @param char The char to compare with
            */
            public _isValUnequal(obj: any, char: string): boolean;
            /**
            * Reset the parser's properties.
            */
            public _resetParser(): void;
            /**
            * Throw an exception in the case of an error.
            *
            * @param error The error message to throw
            */
            public _throwError(error: string): void;
        }
        /**
        * Describes an object that is the result of parsing an expression string. Provides a
        * way to evaluate the expression with a context.
        */
        interface IParsedExpression {
            /**
            * A method for evaluating an expression with a context.
            *
            * @param context The primary context for evaluation.
            * @param aliases An object containing resource alias values. All keys must begin with '@'.
            */
            evaluate(context: any, aliases?: any): any;
            /**
            * The original expression string.
            */
            expression: string;
            /**
            * Contains all the identifiers found in an expression.  Useful for determining
            * properties to watch on a context.
            */
            identifiers: string[];
            /**
            * Contains all the aliases (denoted by an identifier with '@' as the first character) for this IParsedExpression.
            */
            aliases: string[];
            /**
            * Specifies whether or not you want to do a one-time binding on identifiers
            * for this expression. Typically this is added to a clone of the IParsedExpression.
            */
            oneTime?: boolean;
        }
        /**
        * Describes an object that can parse an expression string and turn it into an
        * IParsedExpression. The intended external interface for the '$parser'
        * injectable.
        */
        interface IParser {
            /**
            * Takes in an expression string and outputs an IParsedExpression.
            *
            * @param input An expression string to parse.
            */
            parse(expression: string): IParsedExpression;
        }
    }
    module web {
        /**
        * The class that handles all interaction with the browser.
        */
        class Browser implements IBrowser {
            /**
            * A unique string identifier.
            */
            public uid: string;
            public $EventManagerStatic: events.IEventManagerStatic;
            public $compat: ICompat;
            public $config: IBrowserConfig;
            public $regex: expressions.IRegex;
            public $window: Window;
            private __currentUrl;
            private __lastUrl;
            private __initializing;
            constructor();
            /**
            * Initializes the Browser instance, trims the url, and
            * adds events for popstate and hashchange.
            */
            public initialize(): void;
            /**
            * Sets or gets the current $window.location
            *
            * @param url The URL to set the location to.
            * @param replace Whether or not to replace the current URL in
            * the history.
            */
            public url(url?: string, replace?: boolean): string;
            /**
            * Creates a new IUrlUtils object
            *
            * @param url The URL to associate with the new UrlUtils
            * instance.
            */
            public urlUtils(url?: string): IUrlUtils;
            /**
            * Checks to see if the requested URL is cross domain.
            *
            * @param url The URL to check.
            */
            public isCrossDomain(url: string): boolean;
            /**
            * Obtains the base URL for doing STATE type routing
            *
            * @param url The initial URL passed into the Browser.
            */
            public _getBaseUrl(url: string): string;
            /**
            * The event to fire in the case of a URL change. It kicks
            * off a 'urlChanged' direct event notification.
            */
            public _urlChanged(): void;
            /**
            * Checks for the existence of pushState and
            * sets the browser URL accordingly.
            *
            * @param url The URL to set.
            * @param replace Whether or not to replace the
            * current URL in the history.
            */
            public _setUrl(url: string, replace?: boolean): string;
            /**
            * Formats the URL in the case of HASH routing.
            *
            * @param url The URL to format.
            */
            public _formatUrl(url: string): string;
        }
        /**
        * A class that deals with obtaining detailed information about an
        * associated URL.
        */
        class UrlUtils implements IUrlUtils {
            private static __urlUtilsElement;
            private static __getQuery(search);
            /**
            * The whole associated URL.
            */
            public href: string;
            /**
            * The protocol scheme of the URL, including the final ':' of the associated URL.
            */
            public protocol: string;
            /**
            * The hostname and port of the associated URL.
            */
            public host: string;
            /**
            * The domain of the associated uRL.
            */
            public hostname: string;
            /**
            * The port number of the associated URL.
            */
            public port: string;
            /**
            * The additional path value in the associated URL preceded by a '/'.
            */
            public pathname: string;
            /**
            * A '?' followed by the included parameters in the associated URL.
            */
            public search: string;
            /**
            * A '#' followed by the included hash fragments in the associated URL.
            */
            public hash: string;
            /**
            * The username specified before the domain name in the associated URL.
            */
            public username: string;
            /**
            * The password specified before the domain name in the associated URL.
            */
            public password: string;
            /**
            * The origin of the associated URL (its protocol, domain, and port).
            */
            public origin: string;
            /**
            * An object containing keyed query arguments from the associated URL.
            */
            public query: IObject<string>;
            public $ContextManagerStatic: observable.IContextManagerStatic;
            public $document: Document;
            public $compat: ICompat;
            public $config: IBrowserConfig;
            /**
            * Initiializes this instance of the UrlUtils and defines its properties using
            * the input url.
            *
            * @param url The input to associate with this instance of UrlUtils.
            */
            public initialize(url: string): void;
            /**
            * Allows the UrlUtils instance to display its href property when the toString
            * method is called.
            */
            public toString(): string;
        }
        /**
        * Defines an object that deals with obtaining detailed information about an
        * associated URL.
        */
        interface IUrlUtils {
            /**
            * The whole associated URL.
            */
            href: string;
            /**
            * The protocol scheme of the URL, including the final ':' of the associated URL.
            */
            protocol: string;
            /**
            * The hostname and port of the associated URL.
            */
            host: string;
            /**
            * The domain of the associated uRL.
            */
            hostname: string;
            /**
            * The port number of the associated URL.
            */
            port: string;
            /**
            * The additional path value in the associated URL preceded by a '/'.
            */
            pathname: string;
            /**
            * A '?' followed by the included parameters in the associated URL.
            */
            search: string;
            /**
            * A '#' followed by the included hash fragments in the associated URL.
            */
            hash: string;
            /**
            * The username specified before the domain name in the associated URL.
            */
            username?: string;
            /**
            * The password specified before the domain name in the associated URL.
            */
            password?: string;
            /**
            * The origin of the associated URL (its protocol, domain, and port).
            */
            origin?: string;
            /**
            * An object containing keyed query arguments from the associated URL.
            */
            query?: IObject<string>;
            /**
            * Initiializes this IUrlUtils and defines its properties using
            * the input url.
            *
            * @param url The input to associate with this IUrlUtils.
            */
            initialize(url: string): any;
            /**
            * toString function implementation.
            */
            toString(): string;
        }
        /**
        * Defines an object that handles interaction with the browser.
        */
        interface IBrowser {
            /**
            * Initializes the Browser instance, trims the url, and
            * adds events for popstate and hashchange.
            */
            initialize(): void;
            /**
            * Checks to see if the requested URL is cross domain.
            */
            isCrossDomain(url: string): boolean;
            /**
            * Sets or gets the current $window.location
            *
            * @param url The URL to set the location to.
            * @param replace Whether or not to replace the current URL in
            * the history.
            */
            url(url?: string, replace?: boolean): string;
            /**
            * Creates a new IUrlUtils object
            *
            * @param url The URL to associate with the new UrlUtils
            * instance.
            */
            urlUtils(url?: string): IUrlUtils;
        }
        /**
        * Specifies configuration properties for the Browser
        * injectable.
        */
        class BrowserConfig implements IBrowserConfig {
            /**
            * Contains the constants for use with routingType.
            */
            public routeType: IRouteType;
            /**
            * Allows you to define how your app will route. There are
            * three modes, 'none', 'hash', and 'state'.
            *
            * In 'none' mode, the application will not be responding to
            * url changes.
            *
            * In 'hash' mode, the application will use a hash prefix and
            * all navigation will be managed with hash changes.
            *
            * In 'state' mode, the application will use the 'popstate'
            * event and will be able to manage routes. The web server
            * must be configured to route every url to the root url if
            * using 'state' mode.
            *
            * The default mode is 'none'
            */
            public routingType: string;
            /**
            * If routingType is set to 'hash', this value will be
            * appended to the '#' at the beginning of every route. The
            * default prefix is '', meaning each path will be '#/<path>'.
            */
            public hashPrefix: string;
            /**
            * Specifies the base url used to normalize url routing.
            */
            public baseUrl: string;
        }
        /**
        * Contains the constants for use with routingType.
        */
        interface IRouteType {
            /**
            * Specifies that the application will not be doing
            * url-based routing.
            */
            NONE: string;
            /**
            * Specifies that the application wants to use hash-based
            * routing.
            */
            HASH: string;
            /**
            * Specifies that the application wants to use the HTML5
            * popstate method for managing routing. If the browser
            * does not support HTML5 popstate events, hash routing
            * will be used instead.
            *
            * Note: In 'state' mode, the web server must be configured to
            * route every url to the root url.
            */
            STATE: string;
        }
        /**
        * Specifies configuration properties for the IBrowser
        * injectable.
        */
        interface IBrowserConfig {
            /**
            * Contains the constants for use with routingType.
            */
            routeType: IRouteType;
            /**
            * Allows you to define how your app will route. There are
            * three modes, 'none', 'hash', and 'state'.
            *
            * In 'none' mode, the application will not be responding to
            * url changes.
            *
            * In 'hash' mode, the application will use a hash prefix and
            * all navigation will be managed with hash changes.
            *
            * In 'state' mode, the application will use the 'popstate'
            * event and will be able to manage routes. The web server
            * must be configured to route every url to the root url if
            * using 'state' mode.
            *
            * The default mode is 'none'
            */
            routingType: string;
            /**
            * If routingType is set to 'hash', this value will be
            * appended to the '#' at the beginning of every route. The
            * default prefix is '!', meaning each path will be '#!/<path>'.
            */
            hashPrefix: string;
            /**
            * Specifies the base url used to normalize url routing.
            */
            baseUrl: string;
        }
        /**
        * The class that handles route registration and navigation
        * to and from IViewControls within the Routeport.
        */
        class Router implements IRouter {
            /**
            * A unique string identifier.
            */
            public uid: string;
            /**
            * The registered routes (as IRouteMatchers) for matching
            * on route change.
            */
            public _routes: IRouteMatcher[];
            /**
            * The function to stop listening to the 'urlChanged' event.
            */
            public _removeListener: IRemoveListener;
            /**
            * The registered default route ('') converted into an IMatchedRoute.
            * The default route is used whenever a specified route/url is not matched.
            */
            public _defaultRoute: IMatchedRoute;
            /**
            * The registered base route ('/') converted into an IMatchedRoute.
            * The base route is the first route navigated to in the Routeport if a
            * defaultRoute is not specified in its plat-options.
            */
            public _baseRoute: IMatchedRoute;
            public $browser: IBrowser;
            public $browserConfig: IBrowserConfig;
            public $EventManagerStatic: events.IEventManagerStatic;
            public $NavigationEventStatic: events.INavigationEventStatic;
            public $compat: ICompat;
            public $ExceptionStatic: IExceptionStatic;
            public $regex: expressions.IRegex;
            public $window: Window;
            private __escapeRegex;
            private __optionalRegex;
            private __pathSlashRegex;
            private __firstRoute;
            private __history;
            constructor();
            /**
            * Registers route strings/RegExp and associates them with a control type.
            *
            * @param type The control type with which to associate the routes.
            * @param routes An array of strings or RegExp expressions to associate with
            * the control type.
            */
            public registerRoutes(type: string, routes: any[]): void;
            /**
            * Formats a url path given the parameters and query string, then changes the
            * url to that path.
            *
            * @param path The route to match with a registered ViewControl.
            * @param options The IRouteNavigationOptions associated with this routing
            * operation.
            */
            public route(path: string, options?: IRouteNavigationOptions): void;
            /**
            * Navigates back in the history.
            *
            * @param length The number of entries to go back in the history.
            */
            public goBack(length?: number): void;
            /**
            * Builds a valid route with a valid query string to use for navigation.
            *
            * @param routeParameter The route portion of the navigation path. Used to
            * match with a registered ViewControl.
            * @param query The route query object if passed into the
            * IRouteNavigationOptions.
            */
            public _buildRoute(routeParameter: string, query: IObject<string>): {
                route: string;
                match: IMatchedRoute;
            };
            /**
            * Builds the query string if a query object was passed into
            * the IRouteNavigationOptions.
            *
            * @param query The query object passed in.
            */
            public _buildQueryString(query: IObject<string>): string;
            /**
            * The method called when the route function is invoked
            * or on a 'urlChanged' event.
            *
            * @param ev The 'urlChanged' event object.
            * @param utils The IUrlUtils created for the invoked
            * route function.
            */
            public _routeChanged(ev: events.IDispatchEvent, utils: IUrlUtils): void;
            /**
            * Registers a ViewControl's route.
            *
            * @param route Can be either a string or RegExp.
            * @param injector The injector for the ViewControl defined by
            * the type.
            * @param type The control type.
            */
            public _registerRoute(route: any, injector: dependency.IInjector<ui.IViewControl>, type: string): void;
            /**
            * Parses the route and pulls out route parameters. Then
            * converts them to regular expressions to match for
            * routing.
            *
            * @param route The route to parse.
            */
            public _getRouteParameters(route: string): IRouteMatcher;
            /**
            * Matches a route to a registered route using the
            * registered route's regular expression.
            */
            public _match(utils: IUrlUtils): IMatchedRoute;
            /**
            * Trims the first and last slash on the pathname and returns it.
            *
            * @param utils The IUrlUtils associated with this route function.
            */
            public _getUrlFragment(utils: IUrlUtils): string;
        }
        /**
        * Options that you can submit to the router in order
        * to customize navigation.
        */
        interface IRouteNavigationOptions extends navigation.IBaseNavigationOptions {
            /**
            * An object that includes the query parameters to be inserted into the route
            * as the query string.
            */
            query?: IObject<string>;
        }
        /**
        * Used by the navigator for matching a route with
        * a view control injector.
        */
        interface IRouteMatcher {
            /**
            * The IViewControl injector.
            */
            injector?: dependency.IInjector<ui.IViewControl>;
            /**
            * The type of IViewControl
            */
            type?: string;
            /**
            * A regular expression to match with the url.
            */
            regex: RegExp;
            /**
            * Route arguments used to create IRouteParameters
            * in the event of a url match.
            */
            args: string[];
        }
        /**
        * Extends IRoute to provide a control injector that matches
        * the given IRoute.
        */
        interface IMatchedRoute {
            /**
            * The associated view control injector for the route.
            */
            injector: dependency.IInjector<ui.IViewControl>;
            /**
            * The type of IViewControl
            */
            type: string;
            /**
            * The route associated with the injector
            */
            route?: IRoute<any>;
        }
        /**
        * Contains the parsed properties of a url.
        */
        interface IRoute<T extends {}> {
            /**
            * The defined parameters that were matched with the route.
            * When a route is registered, the registrant can specify named
            * route parameters. Those parameters will appear in this object
            * as key/value pairs.
            */
            parameters: T;
            /**
            * This property will always exist and will be equal to the full
            * route for navigation (only the path from root, not including
            * the query string).
            */
            path: string;
            /**
            * An object containing query string key/value pairs.
            */
            query?: IObject<string>;
        }
        /**
        * Describes the object that handles route registration and navigation
        * to and from IViewControls within the Routeport.
        */
        interface IRouter {
            /**
            * Registers route strings/RegExp and associates them with a control type.
            *
            * @param type The control type with which to associate the routes.
            * @param routes An array of strings or RegExp expressions to associate with
            * the control type.
            */
            registerRoutes(type: string, routes: any[]): any;
            /**
            * Formats a url path given the parameters and query string, then changes the
            * url to that path.
            *
            * @param path The route path to navigate to.
            * @param options The IRouteNavigationOptions included with this route.
            */
            route(path: string, options?: IRouteNavigationOptions): void;
            /**
            * Navigates back in the history.
            *
            * @param length The number of entries to go back in the history.
            */
            goBack(length?: number): void;
        }
    }
    module async {
        /**
        * Adopted from the ES6 promise polyfill: https://github.com/jakearchibald/es6-promise
        *
        * Takes in 2 generic types corresponding to the fullfilled success and error types.
        * The error type (U) should extend Error in order to get proper stack tracing.
        */
        class Promise<T, U extends Error> implements IPromise<T, U> {
            private __subscribers;
            private __state;
            private __detail;
            static config: {
                async: (callback: (arg?: IPromise<any, any>) => void, arg?: IPromise<any, any>) => void;
            };
            /**
            * Returns a promise that fulfills when every item in the array is fulfilled.
            * Casts arguments to promises if necessary. The result argument of the
            * returned promise is an array containing the fulfillment result arguments
            * in-order. The rejection argument is the rejection argument of the
            * first-rejected promise.
            *
            * @param promises An array of promises, although every argument is potentially
            * cast to a promise meaning not every item in the array needs to be a promise.
            * @return {Promise<T, U>} A promise that fulfills when every promise in the array
            * has been fulfilled.
            */
            static all<T, U extends Error>(promises: any[]): IPromise<T, U>;
            /**
            * Creates a promise that fulfills to the passed in object. If the
            * passed-in object is a promise it returns the promise.
            *
            * @param object The object to cast to a Promise.
            */
            static cast<T, U extends Error>(object: T): IPromise<T, U>;
            /**
            * Returns a promise that fulfills as soon as any of the promises fulfill,
            * or rejects as soon as any of the promises reject (whichever happens first).
            *
            * @param promises An Array of promises to 'race'.
            * @return {Promise<T, U>} A promise that fulfills/rejects when the first promise
            * in promises fulfills/rejects.
            */
            static race<T, U extends Error>(promises: IPromise<T, U>[]): IPromise<T, U>;
            /**
            * Returns a promise that resolves with the input value.
            *
            * @param value The value to resolve.
            * @return {Promise<T, any>} A promise that resolves with value.
            */
            static resolve<T>(value: T): IPromise<T, any>;
            /**
            * Returns a promise that rejects with the input value.
            *
            * @param value The value to reject.
            * @return {Promise<void, U>} A promise that rejects with value.
            */
            static reject<U extends Error>(reason: U): IPromise<void, U>;
            private static $Exception;
            private static __invokeResolveFunction<T, U extends Error>(resolveFunction, promise);
            private static __invokeCallback(settled, promise, callback, detail);
            private static __publish(promise, settled);
            private static __publishFulfillment(promise);
            private static __publishRejection(promise);
            private static __reject<U>(promise, reason);
            private static __fulfill<T>(promise, value);
            private static __resolve<T, U extends Error>(promise, value);
            private static __handleThenable<T, U extends Error>(promise, value);
            private static __subscribe(parent, child, onFulfilled, onRejected?);
            /**
            * An ES6 implementation of Promise. Useful for asynchronous programming.
            *
            * @param resolveFunction A IResolveFunction for fulfilling/rejecting the Promise.
            */
            constructor(resolveFunction: IResolveFunction<T, U>);
            /**
            * Takes in two methods, called when/if the promise fulfills/rejects.
            *
            * @param onFulfilled A method called when/if the promise fulills. If undefined the next
            * onFulfilled method in the promise chain will be called.
            * @param onRejected A method called when/if the promise rejects. If undefined the next
            * onRejected method in the promise chain will be called.
            * @return {Promise<T, U>} A Promise used for method chaining.
            */
            public then<TResult, TError>(onFulfilled: (success: T) => TResult, onRejected?: (error: U) => TError): IPromise<T, U>;
            /**
            * A wrapper method for Promise.then(undefined, onRejected);
            *
            * @param onRejected A method called when/if the promise rejects. If undefined the next
            * onRejected method in the promise chain will be called.
            * @return {Promise<T, U>} A Promise used for method chaining.
            */
            public catch<TError>(onRejected: (error: U) => TError): IPromise<T, U>;
        }
        /**
        * The Type for referencing the '$PromiseStatic' injectable as a dependency.
        */
        function PromiseStatic($Exception: any): typeof Promise;
        /**
        * Describes a function passed into the constructor for a Promise. The function allows you to
        * resolve/reject the Promise.
        */
        interface IResolveFunction<T, U extends Error> {
            /**
            * A function which allows you to resolve/reject a Promise.
            *
            * @param resolve A method for resolving a Promise. If you pass in a 'thenable' argument
            * (meaning if you pass in a Promise-like object), then the promise will resolve with the
            * outcome of the object. Else the promise will resolve with the argument.
            * @param reject A method for rejecting a promise. The argument should be an instancof Error
            * to assist with debugging. If a method in the constructor for a Promise throws an error,
            * the promise will reject with the error.
            */
            (resolve: (value?: T) => void, reject: (reason?: U) => void): void;
        }
        /**
        * Describes an object that implements the ES6 Promise API
        */
        interface IPromise<T, U extends Error> {
            /**
            * Takes in two methods, called when/if the promise fulfills/rejects.
            *
            * @param onFulfilled A method called when/if the promise fulills. If undefined the next
            * onFulfilled method in the promise chain will be called.
            * @param onRejected A method called when/if the promise rejects. If undefined the next
            * onRejected method in the promise chain will be called.
            * @return {IPromise<T, U>} An IPromise used for method chaining.
            */
            then<TResult, TError>(onFulfilled: (success: T) => TResult, onRejected?: (error: U) => TError): IPromise<T, U>;
            /**
            * A wrapper method for Promise.then(undefined, onRejected);
            *
            * @param onRejected A method called when/if the promise rejects. If undefined the next
            * onRejected method in the promise chain will be called.
            * @return {IPromise<T, U>} An IPromise used for method chaining.
            */
            catch<TError>(onRejected: (error: U) => TError): IPromise<T, U>;
        }
        /**
        * The injectable reference for the ES6 Promise implementation.
        */
        interface IPromiseStatic {
            /**
            * An ES6 implementation of the Promise API. Useful for asynchronous programming.
            * Takes in 2 generic types corresponding to the fullfilled success and error types.
            * The error type (U) should extend Error in order to get proper stack tracing.
            *
            * @param resolveFunction A IResolveFunction for fulfilling/rejecting the Promise.
            */
            new<T, U extends Error>(resolveFunction: IResolveFunction<T, U>): IPromise<T, U>;
            /**
            * Returns a promise that fulfills when every item in the array is fulfilled.
            * Casts arguments to promises if necessary. The result argument of the
            * returned promise is an array containing the fulfillment result arguments
            * in-order. The rejection argument is the rejection argument of the
            * first-rejected promise.
            *
            * @param promises An array of promises, although every argument is potentially
            * cast to a promise meaning not every item in the array needs to be a promise.
            * @return {Promise<T, U>} A promise that fulfills when every promise in the array
            * has been fulfilled.
            */
            all<T, U extends Error>(promises: any[]): IPromise<T, U>;
            /**
            * Creates a promise that fulfills to the passed in object. If the
            * passed-in object is a promise it returns the promise.
            *
            * @param object The object to cast to a Promise.
            * @return {Promise<T, U>}
            */
            cast<T, U extends Error>(object: T): IPromise<T, U>;
            /**
            * Returns a promise that fulfills as soon as any of the promises fulfill,
            * or rejects as soon as any of the promises reject (whichever happens first).
            *
            * @param promises An Array of promises to 'race'.
            * @return {Promise<T, U>} A promise that fulfills/rejects when the first promise
            * in promises fulfills/rejects.
            */
            race<T, U extends Error>(promises: IPromise<T, U>[]): IPromise<T, U>;
            /**
            * Returns a promise that resolves with the input value.
            *
            * @param value The value to resolve.
            * @return {Promise<T, any>} A promise that resolves with value.
            */
            resolve<T>(value: T): IPromise<T, any>;
            /**
            * Returns a promise that rejects with the input value.
            *
            * @param value The value to reject.
            * @return {Promise<void, U>} A promise that rejects with value.
            */
            reject<U extends Error>(reason: U): IPromise<void, U>;
        }
        /**
        * Describes an object which contains Ajax configuration properties.
        */
        interface IHttpConfigStatic extends IJsonpConfigStatic {
            /**
            * The HTTP method type of XmlHttpRequest such as 'GET', 'POST', 'PUT',
            * 'DELETE', etc. Ignored for non-HTTP urls. Defaults to 'GET'.
            */
            method?: string;
            /**
            * The number of milliseconds a request can take before
            * automatically being terminated. A value of 0
            * means there is no timeout.
            */
            timeout?: number;
            /**
            * An optional user string for the XmlHttpRequest
            */
            user?: string;
            /**
            * An optional password string for the XmlHttpRequest
            */
            password?: string;
            /**
            * The XMLHttpRequestResponseType. The response should
            * still be checked when received due to browser
            * incompatibilities. If a browser does not support a
            * response type it will return the value as a string.
            * The response type does not affect JSONP callback
            * arguments.
            *
            * @see config.XMLHttpRequestResponseType
            */
            responseType?: string;
            /**
            * The Content-Type header for XMLHttpRequest when
            * data is being sent. The default is
            * 'application/x-www-form-urlencoded; charset=UTF-8'.
            */
            contentType?: string;
            /**
            * A key/value pair object where the key is a DOMString header key
            * and the value is the DOMString header value.
            */
            headers?: any;
            /**
            * Indicates whether or not cross-site Access-Control requests
            * should be made using credentials such as cookies or
            * authorization headers. The default is false.
            */
            withCredentials?: boolean;
            /**
            * The request payload
            */
            data?: any;
            /**
            * Forces a JSONP, cross-domain request when set to true.
            * The default is false.
            */
            isCrossDomain?: boolean;
        }
        /**
        * Describes an object which contains JSONP configuration properties.
        */
        interface IJsonpConfigStatic {
            /**
            * The url for the JSONP callback
            * (without the ?{callback}={callback_name} parameter in the url)
            */
            url: string;
            /**
            * The identifier the server uses to get the name of the JSONP
            * callback. The default is 'callback' as seen in
            * http://www.platyfi.com/data?callback=plat_fnName.
            */
            jsonpIdentifier?: string;
            /**
            * A specified name for the JSONP callback (in case the server has
            * it hardcoded and/or does not get it from the given url). The
            * default is a unique plat id generated separately for
            * each JSONP callback seen as 'plat_callback00' in
            * http://www.platyfi.com/data?callback=plat_callback00.
            */
            jsonpCallback?: string;
        }
        /**
        * Describes an object that is the response to an AJAX request.
        */
        interface IAjaxResponse {
            /**
            * The AJAX response or responseText. The response should
            * be checked when received due to browser
            * incompatibilities with responseType. If a browser does
            * not support a response type it will return the value as
            * a string.
            */
            response: any;
            /**
            * The XHR status. Resolves as 200 for JSONP.
            */
            status: number;
            /**
            * A method for getting the XHR response headers.
            */
            getAllResponseHeaders?: () => string;
            /**
            * The XMLHttpRequest object associated with the AJAX call
            */
            xhr?: XMLHttpRequest;
        }
        /**
        * Describes the AjaxPromise's resolve function
        */
        interface IAjaxResolveFunction {
            (resolve: (value?: IAjaxResponse) => any, reject: (reason?: IAjaxError) => any): void;
        }
        /**
        * Describes an object that forms an Error object with an IAjaxResponse.
        */
        interface IAjaxError extends Error, IAjaxResponse {
        }
        /**
        * Describes a type of IPromise that fulfills with an IAjaxResponse and can be optionally canceled.
        */
        interface IAjaxPromise extends IPromise<IAjaxResponse, IAjaxError> {
            /**
            * A method to cancel the AJAX call associated with this AjaxPromise.
            */
            cancel(): void;
            /**
            * Inherited from IPromise
            */
            then<TResult, TError>(onFulfilled: (success: IAjaxResponse) => TResult, onRejected?: (error: IAjaxError) => TError): IAjaxPromise;
        }
        /**
        * Describes an object that provides value mappings for
        * XMLHttpRequestResponseTypes
        */
        interface IHttpResponseType {
            /**
            * The default response type (empty string)
            */
            DEFAULT: string;
            /**
            * The arrayBuffer type ('arrayBuffer')
            */
            ARRAYBUFFER: string;
            /**
            * The blob type ('blob')
            */
            BLOB: string;
            /**
            * The document type ('document')
            */
            DOCUMENT: string;
            /**
            * The json type ('json')
            */
            JSON: string;
            /**
            * The text type ('text')
            */
            TEXT: string;
        }
        /**
        * Describes the interface for the Ajax injectable for making both
        * XMLHttpRequests and JSONP requests.
        */
        interface IHttp {
            /**
            * Describes an object that provides value mappings for
            * XMLHttpRequestResponseTypes
            */
            responseType: IHttpResponseType;
            /**
            * A wrapper method for the Http class that creates and executes a new Http with
            * the specified IAjaxOptions. This function will check if
            * XMLHttpRequest level 2 is present, and will default to JSONP if it isn't and
            * the request is cross-domain.
            *
            * @param options The IAjaxOptions for either the XMLHttpRequest
            * or the JSONP callback.
            * @return {AjaxPromise} A promise, when fulfilled
            * or rejected, will return an IAjaxResponse object.
            */
            ajax(options: IHttpConfigStatic): IAjaxPromise;
            /**
            * A direct method to force a cross-domain JSONP request.
            *
            * @param options The IJsonpOptions
            * @return {AjaxPromise} A promise, when fulfilled
            * or rejected, will return an IAjaxResponse object.
            */
            jsonp? (options: IJsonpConfigStatic): IAjaxPromise;
            /**
            * Makes an ajax request, specifying responseType:
            * config.XMLHttpRequestResponseType.json.
            *
            * @param options The IAjaxOptions for either the XMLHttpRequest
            * or the JSONP callback.
            * @return {AjaxPromise} A promise, when fulfilled or rejected,
            * will return an IAjaxResponse object, with the response being a parsed
            * JSON object (assuming valid JSON).
            */
            json? (options: IHttpConfigStatic): IAjaxPromise;
        }
        /**
        * The instantiated class of the injectable for making
        * AJAX requests.
        */
        class Http implements IHttp {
            /**
            * Default Http config
            */
            static config: IHttpConfigStatic;
            /**
            * HttpResponseType mapping
            */
            public responseType: IHttpResponseType;
            /**
            * A wrapper method for the Http class that creates and executes a new Http with
            * the specified IAjaxOptions. This function will check if
            * XMLHttpRequest level 2 is present, and will default to JSONP if it isn't and
            * the request is cross-domain.
            *
            * @param options The IAjaxOptions for either the XMLHttpRequest
            * or the JSONP callback.
            */
            public ajax(options: IHttpConfigStatic): IAjaxPromise;
            /**
            * A direct method to force a cross-domain JSONP request.
            *
            * @param options The IJsonpOptions
            */
            public jsonp(options: IJsonpConfigStatic): IAjaxPromise;
            /**
            * Makes an ajax request, specifying responseType:
            * config.XMLHttpRequestResponseType.json.
            *
            * @param options The IAjaxOptions for either the XMLHttpRequest
            * or the JSONP callback.
            * @return {AjaxPromise} A promise, when fulfilled or rejected,
            * will return an IAjaxResponse object, with the response being a parsed
            * JSON object (assuming valid JSON).
            */
            public json(options: IHttpConfigStatic): IAjaxPromise;
        }
        /**
        * The Type for referencing the '$http.config' injectable as a dependency.
        */
        function HttpConfigStatic(): IHttpConfigStatic;
    }
    module storage {
        /**
        * A Cache class, for use with the $CacheStatic injectable. Used for storing objects.
        * Takes in a generic type corresponding to the type of objects it contains.
        *
        */
        class Cache<T> implements ICache<T> {
            /**
            * Method for creating a new Cache. Takes a generic type to denote the
            * type of objects stored in the new Cache.  If the Cache already exists
            * in the $CacheStatic, a new Cache will not be created.
            *
            * @static
            * @param id The id of the new Cache.
            * @param options ICacheOptions for customizing the Cache.
            */
            static create<T>(id: string, options?: ICacheOptions): ICache<T>;
            /**
            * Gets a cache out of the $CacheStatic if it exists.
            *
            * @static
            * @param id The identifier used to search for the cache.
            *
            * @returns {Cache<T>|undefined}
            */
            static fetch<T>(id: string): ICache<T>;
            /**
            * Clears the CacheFactory and all of its caches.
            *
            * @static
            */
            static clear(): void;
            private __size;
            private __id;
            private __options;
            /**
            * @param id The id to use to retrieve the cache from the CacheFactory.
            * @param options The ICacheOptions for customizing the cache.
            */
            constructor(id: string, options?: ICacheOptions);
            /**
            * Method for accessing information about the cache.
            */
            public info(): {
                id: string;
                size: number;
                options: ICacheOptions;
            };
            /**
            * Method for inserting an object into the cache.
            *
            * @param key The key to use for storage/retrieval of the object.
            * @param value The value to store with the associated key.
            *
            * @return {T} The value inserted into the cache.
            */
            public put(key: string, value: T): T;
            /**
            * Method for retrieving an object from the cache.
            *
            * @param key The key to search for in the cache.
            *
            * @return {T|undefined} The value found at the associated key. Returns undefined for a cache miss.
            */
            public read(key: string): T;
            /**
            * Method for removing an object from the cache.
            *
            * @param key The key to remove from the cache.
            */
            public remove(key: string): void;
            /**
            * Method for clearing the cache, removing all of its keys.
            */
            public clear(): void;
            /**
            * Method for removing this cache from the $CacheStatic.
            */
            public dispose(): void;
        }
        /**
        * The Type for referencing the '$CacheStatic' injectable as a dependency.
        */
        function CacheStatic(): typeof Cache;
        /**
        * The Type for referencing the '$ManagerCacheStatic' injectable as a dependency.
        */
        function ManagerCacheStatic(): ICache<processing.INodeManager>;
        /**
        * Options for a cache.
        */
        interface ICacheOptions {
            /**
            * Specifies a timeout for a cache value. When a value
            * is put in the cache, it will be valid for the given
            * period of time (in milliseconds). After the timeout
            * is reached, the value will automatically be removed
            * from the cache.
            */
            timeout?: number;
        }
        /**
        * Contains information about an ICache.
        */
        interface ICacheInfo {
            /**
            * A unique id for the ICache object, used to
            * retrieve the ICache out of the $CacheStatic.
            */
            id: string;
            /**
            * Represents the number of items in the ICache.
            */
            size: number;
            /**
            * Represents the ICacheOptions that the ICache is
            * using.
            */
            options: ICacheOptions;
        }
        /**
        * The ICache interface describing a cache. Takes in a generic type
        * corresponding to the type of objects stored in the cache.
        */
        interface ICache<T> {
            /**
            * Method for accessing information about an ICache.
            */
            info(): ICacheInfo;
            /**
            * Method for inserting an object into an ICache.
            *
            * @param key The key to use for storage/retrieval of the object.
            * @param value The value to store with the associated key.
            *
            * @return {T} The value inserted into an ICache.
            */
            put(key: string, value: T): T;
            /**
            * Method for retrieving an object from an ICache.
            *
            * @param key The key to search for in an ICache.
            *
            * @return {T|undefined} The value found at the associated key.
            * Returns undefined for an ICache miss.
            */
            read(key: string): T;
            /**
            * Method for removing an object from an ICache.
            *
            * @param key The key to remove from an ICache.
            */
            remove(key: string): void;
            /**
            * Method for clearing an ICache, removing all of its keys.
            */
            clear(): void;
            /**
            * Method for removing an ICache from the CacheFactory.
            */
            dispose(): void;
        }
        /**
        * External interface for the '$CacheStatic' injectable. CacheStatic is used to manage all
        * the caches for the application.
        */
        interface ICacheStatic {
            /**
            * Method for creating a new ICache. Takes a generic type to denote the
            * type of objects stored in the new ICache.  If the ICache already exists
            * in the ICacheStatic, a new ICache will not be created.
            *
            * @param id The id of the new ICache.
            * @param options ICacheOptions for customizing the ICache.
            *
            * @return {ICache} The newly created ICache object.
            */
            create<T>(id: string, options?: ICacheOptions): ICache<T>;
            /**
            * Gets a cache out of the ICacheStatic if it exists.
            *
            * @param id The identifier used to search for the cache.
            *
            * @returns {ICache|undefined}
            */
            fetch<T>(id: string): ICache<T>;
            /**
            * Clears the ICacheStatic and all of its caches.
            */
            clear(): void;
        }
        /**
        * Interface for TemplateCache, used to manage all templates. Returns a unique template
        * for every read, to avoid having to call cloneNode.
        */
        interface ITemplateCache extends ICache<async.IPromise<DocumentFragment, Error>> {
            /**
            * Takes in a Node or a Promise. If the value is a
            * Node, the node will be cloned and put into the cache.
            *
            * @param key The key used to store the value.
            * @param value The template promise or Node.
            */
            put(key: string, value: any): any;
            /**
            * Method for retrieving a Node from an ITemplateCache. The returned Node will be
            * cloned to avoid manipulating the cached template.
            *
            * @param key The key to search for in an ITemplateCache.
            *
            * @return {Node|async.IPromise<T, Error>} The value found at the associated key.
            * Returns null for an ITemplateCache miss.
            */
            read(key: string): any;
        }
        /**
        * A base class for storing data with a designated storage type.
        */
        class BaseStorage implements IBaseStorage {
            constructor();
            /**
            * Returns the number of items in storage.
            */
            public length : number;
            /**
            * Clears storage, deleting all of its keys.
            */
            public clear(): void;
            /**
            * Gets an item out of local storage with the assigned key.
            *
            * @param key The key of the item to retrieve from storage.
            * @return {T} The item retrieved from storage.
            */
            public getItem<T>(key: string): T;
            /**
            * Allows for iterating over storage keys with an index. When
            * called with an index, it will return the key at that index in
            * storage.
            *
            * @param index The index used to retrieve the associated key.
            * @return {string} The key at the given index.
            */
            public key(index: number): string;
            /**
            * Searches in this.__storage for an item and removes it if it
            * exists.
            *
            * @param key the Key of the item to remove from this.__storage.
            */
            public removeItem(key: string): void;
            /**
            * Adds data to storage with the designated key.
            *
            * @param key The key of the item to store in storage.
            * @param data The data to store in storage with the key.
            */
            public setItem(key: string, data: any): void;
        }
        /**
        * An object designed for storing data with a designated storage type.
        */
        interface IBaseStorage {
            /**
            * Returns the number of items in storage.
            */
            length: number;
            /**
            * Clears storage, deleting all of its keys.
            */
            clear(): void;
            /**
            * Gets an item out of storage with the assigned key.
            *
            * @param key The key of the item to retrieve from storage.
            * @return {T} The item retrieved from storage.
            */
            getItem<T>(key: string): T;
            /**
            * Allows for iterating over storage keys with an index. When
            * called with an index, it will return the key at that index in
            * storage.
            *
            * @param index The index used to retrieve the associated key.
            * @return {string} The key at the given index.
            */
            key(index: number): string;
            /**
            * Searches in storage for an item and removes it if it
            * exists.
            *
            * @param key the Key of the item to remove from storage.
            */
            removeItem(key: string): void;
            /**
            * Adds data to storage with the designated key.
            *
            * @param key The key of the item to store in storage.
            * @param data The data to store in storage with the key.
            */
            setItem(key: string, data: any): void;
        }
        /**
        * A class used to wrap local storage into an injectable.
        */
        class LocalStorage extends BaseStorage implements ILocalStorage {
            private __storage;
        }
        /**
        * Describes an object used to wrap local storage into an injectable.
        */
        interface ILocalStorage {
            /**
            * Returns the number of items in localStorage.
            */
            length: number;
            /**
            * Clears localStorage, deleting all of its keys.
            */
            clear(): void;
            /**
            * Gets an item out of local storage with the assigned key.
            *
            * @param key The key of the item to retrieve from localStorage.
            * @return {T} The item retrieved from localStorage.
            */
            getItem<T>(key: string): T;
            /**
            * Allows for iterating over localStorage keys with an index. When
            * called with an index, it will return the key at that index in
            * localStorage.
            *
            * @param index The index used to retrieve the associated key.
            * @return {string} The key at the given index.
            */
            key(index: number): string;
            /**
            * Searches in localStorage for an item and removes it if it
            * exists.
            *
            * @param key the Key of the item to remove from localStorage.
            */
            removeItem(key: string): void;
            /**
            * Adds data to localStorage with the designated key.
            *
            * @param key The key of the item to store in localStorage.
            * @param data The data to store in localStorage with the key.
            */
            setItem(key: string, data: any): void;
        }
        /**
        * A class for wrapping SessionStorage as an injectable.
        */
        class SessionStorage extends BaseStorage implements ISessionStorage {
            private __storage;
        }
        /**
        * Describes an object used to wrap session storage into an injectable.
        */
        interface ISessionStorage {
            /**
            * Returns the number of items in sessionStorage.
            */
            length: number;
            /**
            * Clears sessionStorage, deleting all of its keys.
            */
            clear(): void;
            /**
            * Gets an item out of session storage with the assigned key.
            *
            * @param key The key of the item to retrieve from sessionStorage.
            * @return {T} The item retrieved from sessionStorage.
            */
            getItem<T>(key: string): T;
            /**
            * Allows for iterating over sessionStorage keys with an index. When
            * called with an index, it will return the key at that index in
            * sessionStorage.
            *
            * @param index The index used to retrieve the associated key.
            * @return {string} The key at the given index.
            */
            key(index: number): string;
            /**
            * Searches in sessionStorage for an item and removes it if it
            * exists.
            *
            * @param key the Key of the item to remove from sessionStorage.
            */
            removeItem(key: string): void;
            /**
            * Adds data to sessionStorage with the designated key.
            *
            * @param key The key of the item to store in sessionStorage.
            * @param data The data to store in sessionStorage with the key.
            */
            setItem(key: string, data: any): void;
        }
    }
    module observable {
        /**
        * Manages observable properties on control.
        * Facilitates in data-binding and managing context inheritance.
        */
        class ContextManager implements IContextManager {
            /**
            * A set of functions to be fired when a particular observed array is mutated.
            */
            static observedArrayListeners: IObject<IObject<(ev: IArrayMethodInfo<any>) => void>>;
            /**
            * Gets the ContextManager associated to the given control. If no
            * ContextManager exists, one is created for that control.
            *
            * @static
            * @param control The control on which to locate the ContextManager
            */
            static getManager(control: IControl): IContextManager;
            /**
            * Removes all the listeners for a given control's uid.
            *
            * @static
            * @param control The control whose manager is being disposed.
            * @param persist Whether or not the control's context needs to
            * be persisted post-disposal or can be set to null.
            */
            static dispose(control: IControl, persist?: boolean): any;
            /**
            * Removes all listeners for an Array associated with a given uid.
            *
            * @static
            * @param absoluteIdentifier The identifier used to locate the array.
            * @param uid The uid used to search for listeners.
            */
            static removeArrayListeners(absoluteIdentifier: string, uid: string): void;
            /**
            * Safely retrieves the local context given a root context and an Array of
            * property strings.
            *
            * @static
            * @param rootContext The root object in which to find a local context.
            * @param split The string array containing properties used to index into
            * the rootContext.
            */
            static getContext(rootContext: any, split: string[]): any;
            /**
            * Defines an object property with the associated value. Useful for unobserving objects.
            *
            * @param obj The object on which to define the property.
            * @param key The property key.
            * @param value The value used to define the property.
            * @param enumerable Whether or not the property should be enumerable (able to be iterated
            * over in a loop)
            * @param configurable Whether or not the property is able to be reconfigured.
            */
            static defineProperty(obj: any, key: string, value: any, enumerable?: boolean, configurable?: boolean): void;
            /**
            * Defines an object property with only a getter function. Useful for creating constant values
            * or overwriting constant values.
            *
            * @param obj The object on which to define the property.
            * @param key The property key.
            * @param value The value used to define the property.
            * @param enumerable Whether or not the property should be enumerable (able to be iterated
            * over in a loop)
            * @param configurable Whether or not the property is able to be reconfigured.
            */
            static defineGetter(obj: any, key: string, value: any, enumerable?: boolean, configurable?: boolean): void;
            /**
            * Pushes the function for removing an observed property upon adding the property.
            *
            * @static
            * @param identifer The identifier for which the remove listener is being pushed.
            * @param uid The uid of the control observing the identifier.
            * @param listener The function for removing the observed property.
            */
            static pushRemoveListener(identifier: string, uid: string, listener: IRemoveListener): void;
            /**
            * Removes a specified identifier from being observed for a given set of control uids.
            *
            * @static
            * @param uids The set of uids for which to remove the specified identifier.
            * @param identifier The identifier to stop observing.
            */
            static removeIdentifier(uids: string[], identifier: string): void;
            private static __managers;
            private static __controls;
            /**
            * The context being managed by this ContextManger instance.
            */
            public context: any;
            public $ContextManagerStatic: IContextManagerStatic;
            public $compat: ICompat;
            public $ExceptionStatic: IExceptionStatic;
            private __identifiers;
            private __identifierHash;
            private __contextObjects;
            private __isArrayFunction;
            private __observedIdentifier;
            /**
            * Safely retrieves the local context for this ContextManager given an Array of
            * property strings.
            *
            * @param split The string array containing properties used to index into
            * the context.
            */
            public getContext(split: string[]): any;
            /**
            * Given a period-delimited identifier, observes an object and calls the given listener when the
            * object changes.
            *
            * @param absoluteIdentifier The period-delimited identifier noting the property to be observed.
            * @param observableListener An object implmenting IObservableListener. The listener will be
            * notified of object changes.
            */
            public observe(absoluteIdentifier: string, observableListener: IListener): IRemoveListener;
            /**
            * Observes an array and calls the listener when certain functions are called on
            * that array. The watched functions are push, pop, shift, splice, unshift, sort,
            * and reverse.
            *
            * @param control The control that is observing the array.
            * @param listener The callback for when an observed Array function has been called.
            * @param absoluteIdentifier The identifier from the root context used to find the array.
            * @param array The array to be observed.
            * @param oldArray The old array to stop observing.
            */
            public observeArray(control: IControl, listener: (ev: IArrayMethodInfo<any>) => void, absoluteIdentifier: string, array: any[], oldArray: any[]): void;
            /**
            * Disposes the memory retained by this ContextManager.
            */
            public dispose(): void;
            /**
            * Gets the immediate context of identifier by splitting on '.'
            * and observes the objects along the way.
            *
            * @param identifier The identifier being observed.
            */
            public _getImmediateContext(identifier: string): any;
            /**
            * Obtains the old value and new value of a given context
            * property on a property changed event.
            *
            * @param split The split identifier of the property that changed.
            * @param newRootContext The new context.
            * @param oldRootContext The old context.
            */
            public _getValues(split: string[], newRootContext: any, oldRootContext: any): {
                newValue: any;
                oldValue: any;
            };
            /**
            * Notifies all child properties being observed that a parent property
            * has changed.
            *
            * @param identifier The identifier for the property that changed.
            * @param newValue The new value of the property.
            * @param oldValue The old value of the property.
            */
            public _notifyChildProperties(identifier: string, newValue: any, oldValue: any): void;
            /**
            * Adds a listener to be fired for a particular identifier.
            *
            * @param absoluteIdentifier The identifier being observed.
            * @param observableListener The function and associated uid to be fired
            * for this identifier.
            */
            public _addObservableListener(absoluteIdentifier: string, observableListener: IListener): IRemoveListener;
            /**
            * Observes a property on a given context specified by an identifier.
            *
            * @param identifier The full identifier path for the property being observed.
            * @param immediateContext The object whose property will be observed.
            * @param key The property key for the value on the immediateContext that's
            * being observed.
            */
            public _define(identifier: string, immediateContext: any, key: string): void;
            /**
            * Intercepts an array function for observation.
            *
            * @param absoluteIdentifier The full identifier path for the observed array.
            * @param method The array method being called.
            */
            public _overwriteArrayFunction(absoluteIdentifier: string, method: string): (...args: any[]) => any;
            /**
            * Removes listener callbacks based on control uid.
            *
            * @param identifier The identifier attached to the callbacks.
            * @param uid The uid to remove the callback from.
            */
            public _removeCallback(identifier: string, uid: string): void;
            /**
            * Checks if the specified identifier is already being
            * observed in this context.
            *
            * @param identifier The identifier being observed.
            */
            public _hasIdentifier(identifier: string): boolean;
            /**
            * Executes the listeners for the specified identifier on
            * this context.
            *
            * @param identifier The identifier attached to the callbacks.
            * @param value The new value on this context specified by
            * the identifier.
            * @param oldValue The old value on this context specified by
            * the identifier.
            */
            public _execute(identifier: string, value: any, oldValue: any): void;
            private __defineObject(identifier, immediateContext, key);
            private __definePrimitive(identifier, immediateContext, key);
            private __add(identifier, observableListener);
            private __addHashValues(identifier);
        }
        /**
        * The Type for referencing the '$ContextManagerStatic' injectable as a dependency.
        */
        function ContextManagerStatic(): typeof ContextManager;
        /**
        * Describes an object that manages observing properties on any object.
        */
        interface IContextManager {
            /**
            * The context to be managed.
            */
            context: any;
            /**
            * Safely retrieves the local context for this ContextManager given an Array of
            * property strings.
            *
            * @param split The string array containing properties used to index into
            * the context.
            */
            getContext(split: string[]): any;
            /**
            * Given a period-delimited identifier, observes an object and calls the given listener when the
            * object changes.
            *
            * @param absoluteIdentifier The period-delimited identifier noting the property to be observed.
            * @param observableListener An object implmenting IObservableListener. The listener will be
            * notified of object changes.
            */
            observe(identifier: string, observableListener: IListener): IRemoveListener;
            /**
            * Observes an array and calls the listener when certain functions are called on
            * that array. The watched functions are push, pop, shift, splice, unshift, sort,
            * and reverse.
            *
            * @param control The control that is observing the array.
            * @param listener The callback for when an observed Array function has been called.
            * @param absoluteIdentifier The identifier from the root context used to find the array.
            * @param array The array to be observed.
            * @param oldArray The old array to stop observing.
            */
            observeArray(control: IControl, listener: (ev: IArrayMethodInfo<any>) => void, absoluteIdentifier: string, array: any[], oldArray: any[]): void;
            /**
            * Disposes the memory for an IContextManager.
            */
            dispose(): any;
        }
        /**
        * An object specifying a listener callback function and a unique id to use to manage the
        * listener.
        */
        interface IListener {
            /**
            * A listener method called when the object it is observing is changed.
            *
            * @param value The new value of the object.
            * @param oldValue The previous value of the object.
            */
            listener(value: any, oldValue: any): void;
            /**
            * A unique id used to manage the listener.
            */
            uid: string;
        }
        /**
        * An object for Array method info. Takes a
        * generic type to denote the type of array it uses.
        */
        interface IArrayMethodInfo<T> {
            /**
            * The method name that was called. Possible values are:
            * 'push', 'pop', 'reverse', 'shift', 'sort', 'splice',
            * and 'unshift'
            */
            method: string;
            /**
            * The value returned from the called function.
            */
            returnValue: any;
            /**
            * The previous value of the array.
            */
            oldArray: T[];
            /**
            * The new value of the array.
            */
            newArray: T[];
            /**
            * The arguments passed into the array function.
            */
            arguments: any[];
        }
        /**
        * The external interface for the '$ContextManagerStatic' injectable.
        */
        interface IContextManagerStatic {
            /**
            * A set of functions to be fired when a particular observed array is mutated.
            *
            * @static
            */
            observedArrayListeners: IObject<IObject<(ev: IArrayMethodInfo<any>) => void>>;
            /**
            * Gets the ContextManager associated to the given control. If no
            * ContextManager exists, one is created for that control.
            *
            * @static
            * @param control The control on which to locate the ContextManager
            */
            getManager(control: IControl): IContextManager;
            getManager(control: any): IContextManager;
            /**
            * Removes all the listeners for a given control's uid.
            *
            * @static
            * @param control The control whose manager is being disposed.
            * @param persist Whether or not the control's context needs to
            * be persisted post-disposal or can be set to null.
            */
            dispose(control: IControl, persist?: boolean): any;
            dispose(control: ui.ITemplateControl, persist?: boolean): void;
            /**
            * Removes all listeners for an Array associated with a given uid.
            *
            * @static
            * @param absoluteIdentifier The identifier used to locate the array.
            * @param uid The uid used to search for listeners.
            */
            removeArrayListeners(absoluteIdentifier: string, uid: string): void;
            /**
            * Safely retrieves the local context given a root context and an Array of
            * property strings.
            *
            * @static
            * @param rootContext The root object in which to find a local context.
            * @param split The string array containing properties used to index into
            * the rootContext.
            */
            getContext(rootContext: any, split: string[]): any;
            /**
            * Defines an object property with the associated value. Useful for unobserving objects.
            *
            * @static
            * @param obj The object on which to define the property.
            * @param key The property key.
            * @param value The value used to define the property.
            * @param enumerable Whether or not the property should be enumerable (able to be iterated
            * over in a loop)
            * @param configurable Whether or not the property is able to be reconfigured.
            */
            defineProperty(obj: any, key: string, value: any, enumerable?: boolean, configurable?: boolean): void;
            /**
            * Defines an object property as a getter with the associated value. Useful for unobserving objects.
            *
            * @static
            * @param obj The object on which to define the property.
            * @param key The property key.
            * @param value The value used to define the property.
            * @param enumerable Whether or not the property should be enumerable (able to be iterated
            * over in a loop)
            * @param configurable Whether or not the property is able to be reconfigured.
            */
            defineGetter(obj: any, key: string, value: any, enumerable?: boolean, configurable?: boolean): void;
            /**
            * Pushes the function for removing an observed property upon adding the property.
            *
            * @static
            * @param identifer The identifier for which the remove listener is being pushed.
            * @param uid The uid of the control observing the identifier.
            * @param listener The function for removing the observed property.
            */
            pushRemoveListener(identifier: string, uid: string, listener: IRemoveListener): any;
            /**
            * Removes a specified identifier from being observed for a given set of control uids.
            *
            * @static
            * @param uids The set of uids for which to remove the specified identifier.
            * @param identifier The identifier to stop observing.
            */
            removeIdentifier(uids: string[], identifier: string): any;
        }
        /**
        * Defines the object added to a template control when its element
        * has an attribute control that extends controls.ObservableAttributeControl.
        *
        * This will contain the value of the expression as well as a way to observe the
        * attribute value for changes.
        *
        * plat-options is a control that implements this interface, and puts an 'options'
        * property on its associated template control.
        *
        * The generic type corresponds to the type of object created when the attribute
        * expression is evaluated.
        */
        interface IObservableProperty<T> {
            /**
            * The value obtained from evaluating the attribute's expression.
            */
            value: T;
            /**
            * A method for observing the attribute for changes.
            *
            * @param listener The listener callback which will be pre-bound to the
            * template control.
            *
            * @return {IRemoveListener} A method for removing the listener.
            */
            observe(listener: (newValue: T, oldValue: T) => void): IRemoveListener;
        }
    }
    module events {
        class DispatchEvent implements IDispatchEvent {
            public $EventManagerStatic: IEventManagerStatic;
            /**
            * The object that initiated the event.
            */
            public sender: any;
            /**
            * The name of the event.
            */
            public name: string;
            /**
            * The event direction this object is using for propagation.
            */
            public direction: string;
            /**
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction The event direction this object is using for propagation.
            *
            * @see EventManager
            */
            public initialize(name: string, sender: any, direction?: string): any;
            /**
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction='up' Equivalent to EventManager.UP.
            *
            * @see EventManager
            */
            public initialize(name: string, sender: any, direction?: 'up'): any;
            /**
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction='down' Equivalent to EventManager.DOWN.
            *
            * @see EventManager
            */
            public initialize(name: string, sender: any, direction?: 'down'): any;
            /**
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction='direct' Equivalent to EventManager.DIRECT.
            *
            * @see EventManager
            */
            public initialize(name: string, sender: any, direction?: 'direct'): any;
            /**
            * Call this method to halt the propagation of an upward-moving event.
            * Other events cannot be stopped with this method.
            */
            public stopPropagation(): void;
        }
        /**
        * Describes an event that propagates through a control tree.
        * Propagation of the event always starts at the sender, allowing a control to both
        * initialize and consume an event. If a consumer of an event throws an error while
        * handling the event it will be logged to the app using exception.warn. Errors will
        * not stop propagation of the event.
        */
        interface IDispatchEvent {
            /**
            * The object that initiated the event.
            */
            sender: any;
            /**
            * The name of the event.
            */
            name: string;
            /**
            * The event direction this object is using for propagation.
            */
            direction: string;
            /**
            * Call this method to halt the propagation of an upward-moving event.
            * Downward events cannot be stopped with this method.
            */
            stopPropagation(): void;
            /**
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction='up' Equivalent to EventManager.UP.
            *
            * @see EventManager
            */
            initialize(name: string, sender: any, direction?: 'up'): any;
            /**
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction='down' Equivalent to EventManager.DOWN.
            *
            * @see EventManager
            */
            initialize(name: string, sender: any, direction?: 'down'): any;
            /**
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction='direct' Equivalent to EventManager.DIRECT.
            *
            * @see EventManager
            */
            initialize(name: string, sender: any, direction?: 'direct'): any;
            /**
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction The event direction this object is using for propagation.
            *
            *
            * @see EventManager
            */
            initialize(name: string, sender: any, direction?: string): any;
        }
        /**
        * Represents a Lifecycle Event. Lifecycle Events are always direct events.
        */
        class LifecycleEvent extends DispatchEvent implements ILifecycleEvent {
            /**
            * Creates a new LifecycleEvent and fires it.
            *
            * @param name The name of the event.
            * @param sender The sender of the event.
            */
            static dispatch(name: string, sender: any): void;
            /**
            * Initializes the lifecycle event.
            *
            * @param name The name of the event.
            * @param sender The sender of the event.
            */
            public initialize(name: string, sender: any): void;
        }
        /**
        * The Type for referencing the '$LifecycleEventStatic' injectable as a dependency.
        */
        function LifecycleEventStatic(): typeof LifecycleEvent;
        /**
        * Defines an object that represents a Lifecycle Event
        */
        interface ILifecycleEvent extends IDispatchEvent {
            /**
            * Initializes the lifecycle event.
            *
            * @param name The name of the event.
            * @param sender The sender of the event.
            */
            initialize(name: string, sender: any): void;
        }
        /**
        * The intended external interface for the '$LifecycleEventStatic' injectable.
        */
        interface ILifecycleEventStatic {
            /**
            * Creates a new LifecycleEvent and fires it.
            *
            * @param name The name of the event.
            * @param sender The sender of the event.
            */
            dispatch(name: string, sender: any): void;
        }
        /**
        * Event object for a control dispatch event. Contains information about the type of event.
        * Propagation of the event always starts at the sender, allowing a control to both
        * initialize and consume an event. If a consumer of an event throws an error while
        * handling the event it will be logged to the app using exception.warn. Errors will
        * not stop propagation of the event.
        */
        class EventManager {
            /**
            * Contains the constants for specifying event direction.
            */
            static direction: IDirection;
            /**
            * Keeps track of which events are currently propagating.
            */
            static propagatingEvents: {};
            static $compat: ICompat;
            static $document: Document;
            static $window: Window;
            static $ExceptionStatic: IExceptionStatic;
            private static __eventsListeners;
            private static __lifecycleEventListeners;
            private static __initialized;
            /**
            * Initializes the EventManager, creating the initial ALM event listeners.
            *
            * @static
            */
            static initialize(): void;
            /**
            * Removes all event listeners for a given uid. Useful for garbage collection when
            * certain objects that listen to events go out of scope.
            *
            * @static
            * @param uid The uid for which the event listeners will be removed.
            */
            static dispose(uid: string): void;
            /**
            * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is
            * propagating over the given uid. Any number of listeners can exist for a single event name.
            *
            * @static
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName The name of the event to listen to.
            * @param listener The method called when the DispatchEvent is fired.
            * @return {IRemoveListener} A method for removing the listener.
            */
            static on(uid: string, eventName: string, listener: (ev: IDispatchEvent, ...args: any[]) => void, context?: any): IRemoveListener;
            /**
            * Looks for listeners to a given event name, and fires the listeners using the specified
            * event direction.
            *
            * @static
            * @param name The name of the event.
            * @param sender The object sending the event.
            * @param direction The eventDirection in which to send the event.
            * @param args The arguments to send to the listeners.
            *
            * @see eventDirection
            */
            static dispatch(name: string, sender: any, direction: string, args?: any[]): any;
            /**
            * Looks for listeners to a given event name, and fires the listeners using the specified
            * event direction.
            *
            * @static
            * @param name The name of the event.
            * @param sender The object sending the event.
            * @param direction='up' Equivalent to EventManager.UP.
            * @param args The arguments to send to the listeners.
            *
            * @see eventDirection
            */
            static dispatch(name: string, sender: any, direction: 'up', args?: any[]): any;
            /**
            * Looks for listeners to a given event name, and fires the listeners using the specified
            * event direction.
            *
            * @static
            * @param name The name of the event.
            * @param sender The object sending the event.
            * @param direction='down' Equivalent to EventManager.DOWN.
            * @param args The arguments to send to the listeners.
            *
            * @see eventDirection
            */
            static dispatch(name: string, sender: any, direction: 'down', args?: any[]): any;
            /**
            * Looks for listeners to a given event name, and fires the listeners using the specified
            * event direction.
            *
            * @static
            * @param name The name of the event.
            * @param sender The object sending the event.
            * @param direction='direct' Equivalent to EventManager.DIRECT.
            * @param args The arguments to send to the listeners.
            *
            * @see eventDirection
            */
            static dispatch(name: string, sender: any, direction: 'direct', args?: any[]): any;
            /**
            * Returns whether or not the given string is a registered direction.
            */
            static hasDirection(direction: string): boolean;
            /**
            * Determines the appropriate direction and dispatches the event accordingly.
            */
            static sendEvent(event: IDispatchEvent, args?: any[]): void;
            /**
            * Dispatches the event up the control chain.
            */
            static _dispatchUp(event: IDispatchEvent, args: any[]): void;
            /**
            * Dispatches the event down the control chain.
            */
            static _dispatchDown(event: IDispatchEvent, args: any[]): void;
            /**
            * Dispatches the event directly to all control's listening.
            */
            static _dispatchDirect(event: IDispatchEvent, args: any[]): void;
            private static __executeEvent(uid, ev, args);
            private static __callListeners(context, ev, listeners, args);
        }
        /**
        * The Type for referencing the '$EventManagerStatic' injectable as a dependency.
        */
        function EventManagerStatic($compat: any, $document: any, $window: any, $ExceptionStatic: any): typeof EventManager;
        /**
        * Desscribes an object that contains event listeners.
        */
        interface IEventsListener {
            /**
            * An IObject of listener arrays, keyed by event name.
            */
            listeners: IObject<{
                (ev: IDispatchEvent, ...args: any[]): void;
            }[]>;
            /**
            * The context with which to call each event listener.
            */
            context: any;
        }
        /**
        * Contains the constants for specifying event direction.
        */
        interface IDirection {
            /**
            * An upward-moving event will start at the sender and move
            * up the parent chain.
            */
            UP: string;
            /**
            * A downward-moving event will start at the sender and move
            * to its children and beyond.
            */
            DOWN: string;
            /**
            * Goes through all listeners for an event name, ignoring order.
            */
            DIRECT: string;
        }
        /**
        * An object for managing control events.
        */
        interface IEventManagerStatic {
            /**
            * Contains the constants for specifying event direction.
            */
            direction: IDirection;
            /**
            * Keeps track of which events are currently propagating.
            */
            propagatingEvents: {};
            /**
            * Initializes the EventManager, creating the initial ALM event listeners.
            */
            initialize(): void;
            /**
            * Removes all event listeners for a given uid. Useful for garbage collection when
            * certain objects that listen to events go out of scope.
            *
            * @param uid The uid for which the event listeners will be removed.
            */
            dispose(uid: string): void;
            /**
            * Registers a listener for the beforeNavigate Event. The listener will be called when the beforeNavigate
            * event is propagating over the given uid. Any number of listeners can exist for a single event name. The
            * listener can chose to cancel the event using ev.cancel(), preventing any navigation as well as further
            * calls to event listeners.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName='beforeNavigate' Specifies that this is a listener for the beforeNavigate event.
            * @param listener The method called when the beforeNavigate event is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: 'beforeNavigate', listener: (ev: INavigationEvent<any, any, navigation.IBaseNavigator>) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for the navigating Event. The listener will be called when the navigating
            * event is propagating over the given uid. Any number of listeners can exist for a single event name.
            * The listener can chose to cancel the event using ev.cancel(), preventing any navigation as well as further
            * calls to event listeners.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName='navigating' Specifies that this is a listener for the navigating event.
            * @param listener The method called when the navigating event is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: 'navigating', listener: (ev: INavigationEvent<any, any, navigation.IBaseNavigator>) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for the navigated Event. The listener will be called when the navigated
            * event is propagating over the given uid. Any number of listeners can exist for a single event name.
            * The listener cannot cancel the event.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName='navigated' Specifies that this is a listener for the navigated event.
            * @param listener The method called when the navigated event is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: 'navigated', listener: (ev: INavigationEvent<ui.IViewControl, any, navigation.IBaseNavigator>) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for a NavigationEvent. The listener will be called when a NavigationEvent is
            * propagating over the given uid. Any number of listeners can exist for a single event name.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName The name of the event to listen to.
            * @param listener The method called when the NavigationEvent is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: string, listener: (ev: INavigationEvent<any, any, navigation.IBaseNavigator>) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for the ready AlmEvent. The ready event will be called when the app
            * is ready to start.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName='ready' Specifies that the listener is for the ready event.
            * @param listener The method called when the app is ready to start.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: 'ready', listener: (ev: ILifecycleEvent) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for the suspend AlmEvent. The listener will be called when an app
            * is being suspended.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName='suspend' Specifies the listener is for the suspend event.
            * @param listener The method called when the suspend event is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: 'suspend', listener: (ev: ILifecycleEvent) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for the resume AlmEvent. The listener will be called when an app
            * is being resumeed.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName='suspend' Specifies the listener is for the resume event.
            * @param listener The method called when the resume event is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: 'resume', listener: (ev: ILifecycleEvent) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for the online AlmEvent. This event fires when the app's network
            * connection changes to be online.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName='online' Specifies the listener is for the online event.
            * @param listener The method called when the online event is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: 'online', listener: (ev: ILifecycleEvent) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for the offline AlmEvent. This event fires when the app's network
            * connection changes to be offline.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName='offline' Specifies the listener is for the offline event.
            * @param listener The method called when the offline is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: 'offline', listener: (ev: ILifecycleEvent) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for an AlmEvent. The listener will be called when an AlmEvent is
            * propagating over the given uid. Any number of listeners can exist for a single event name.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName The name of the event to listen to.
            * @param listener The method called when the AlmEvent is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: string, listener: (ev: ILifecycleEvent) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for a ErrorEvent. The listener will be called when a ErrorEvent is
            * propagating over the given uid. Any number of listeners can exist for a single event name.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName The name of the event to listen to.
            * @param listener The method called when the ErrorEvent is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: 'error', listener: (ev: IErrorEvent<Error>) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for a ErrorEvent. The listener will be called when a ErrorEvent is
            * propagating over the given uid. Any number of listeners can exist for a single event name.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName The name of the event to listen to.
            * @param listener The method called when the ErrorEvent is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: string, listener: (ev: IErrorEvent<any>) => void, context?: any): IRemoveListener;
            /**
            * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is
            * propagating over the given uid. Any number of listeners can exist for a single event name.
            *
            * @param uid A unique id to associate with the object registering the listener.
            * @param eventName The name of the event to listen to.
            * @param listener The method called when the DispatchEvent is fired.
            * @param context Optional context with which the listener will be bound.
            * @return {IRemoveListener} A method for removing the listener.
            */
            on(uid: string, eventName: string, listener: (ev: IDispatchEvent, ...args: any[]) => void, context?: any): IRemoveListener;
            /**
            * Looks for listeners to a given event name, and fires the listeners using the specified
            * event direction.
            *
            * @static
            * @param name The name of the event.
            * @param sender The object sending the event.
            * @param direction='up' Equivalent to EventManager.UP.
            * @param args The arguments to send to the listeners.
            *
            * @see eventDirection
            */
            dispatch(name: string, sender: any, direction: 'up', args?: any[]): void;
            /**
            * Looks for listeners to a given event name, and fires the listeners using the specified
            * event direction.
            *
            * @static
            * @param name The name of the event.
            * @param sender The object sending the event.
            * @param direction='down' Equivalent to EventManager.DOWN.
            * @param args The arguments to send to the listeners.
            *
            * @see eventDirection
            */
            dispatch(name: string, sender: any, direction: 'down', args?: any[]): void;
            /**
            * Looks for listeners to a given event name, and fires the listeners using the specified
            * event direction.
            *
            * @static
            * @param name The name of the event.
            * @param sender The object sending the event.
            * @param direction='direct' Equivalent to EventManager.DIRECT.
            * @param args The arguments to send to the listeners.
            *
            * @see eventDirection
            */
            dispatch(name: string, sender: any, direction: 'direct', args?: any[]): void;
            /**
            * Looks for listeners to a given event name, and fires the listeners using the specified
            * event direction.
            *
            * @static
            * @param name The name of the event.
            * @param sender The object sending the event.
            * @param direction The eventDirection in which to send the event.
            * @param args The arguments to send to the listeners.
            *
            * @see eventDirection
            */
            dispatch(name: string, sender: any, direction: string, args?: any[]): void;
            /**
            * Returns whether or not the given string is a registered direction.
            */
            hasDirection(direction: string): boolean;
            /**
            * Determines the appropriate direction and dispatches the event accordingly.
            */
            sendEvent(event: IDispatchEvent, args?: any[]): any;
        }
        /**
        * A class used by the Navigator to dispatch Navigation events. Allows anyone to listen
        * for navigation events and respond to them, even canceling them if necessary.
        */
        class NavigationEvent<T, U, V> extends DispatchEvent implements INavigationEvent<T, U, V> {
            static $EventManagerStatic: IEventManagerStatic;
            /**
            * Dispatches an event with the specified target type.
            *
            * @param name The name of the event (e.g. 'beforeNavigate')
            * @param sender The object sending the event.
            * @param eventOptions An object implementing INavigationEvent, specifying what all event listeners
            * will be passed.
            */
            static dispatch<T, U, V>(name: string, sender: V, eventOptions: INavigationEventOptions<T, U>): NavigationEvent<T, U, V>;
            /**
            * Navigation parameter, used to send objects from one view control to another.
            */
            public parameter: any;
            /**
            * The INavigationOptions in use for the navigation.
            */
            public options: navigation.IBaseNavigationOptions;
            /**
            * The navigation event target. Its type depends on the type of Navigation event.
            */
            public target: T;
            /**
            * Specifies the type of IViewControl for the Route Event.
            */
            public type: string;
            /**
            * States whether or not this event is able to be canceled. Some navigation events can be
            * canceled, preventing further navigation.
            */
            public cancelable: boolean;
            /**
            * States whether or not this event has been canceled.
            */
            public canceled: boolean;
            /**
            * Initializes the event members.
            *
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction This will always be a direct event no matter what is sent in.
            *
            * @see eventDirection
            */
            public initialize(name: string, sender: V, direction?: string, eventOptions?: INavigationEventOptions<T, U>): void;
            /**
            * If the event is cancelable (ev.cancelable), calling this method will cancel the event.
            */
            public cancel(): void;
        }
        /**
        * The Type for referencing the '$NavigationEventStatic' injectable as a dependency.
        */
        function NavigationEventStatic($EventManagerStatic: any): typeof NavigationEvent;
        /**
        * Describes options for an INavigationEvent. The generic parameter specifies the
        * target type for the event.
        */
        interface INavigationEventOptions<T, U> {
            /**
            * Navigation parameter, used to send objects from one view control to another.
            */
            parameter: U;
            /**
            * The INavigationOptions in use for the navigation.
            */
            options: navigation.IBaseNavigationOptions;
            /**
            * The navigation event target. Its type depends on the type of Navigation event.
            */
            target: T;
            /**
            * Specifies the type of IViewControl for the Route Event.
            */
            type: string;
            /**
            * States whether or not this event is able to be canceled. Some navigation events can be
            * canceled, preventing further navigation.
            */
            cancelable?: boolean;
        }
        /**
        * Describes an object used by the Navigator to dispatch Navigation events.
        */
        interface INavigationEvent<T, U, V> extends IDispatchEvent {
            /**
            * Navigation parameter, used to send objects from one view control to another.
            */
            parameter: U;
            /**
            * The INavigationOptions in use for the navigation.
            */
            options: navigation.IBaseNavigationOptions;
            /**
            * The navigation event target. Its type depends on the type of Navigation event.
            */
            target: T;
            /**
            * Specifies the type of IViewControl for the Route Event.
            */
            type: string;
            /**
            * The sender of the event.
            */
            sender: V;
            /**
            * States whether or not this event is able to be canceled. Some navigation events can be
            * canceled, preventing further navigation.
            */
            cancelable?: boolean;
            /**
            * States whether or not this event has been canceled.
            */
            canceled?: boolean;
            /**
            * If the event is cancelable (ev.cancelable), calling this method will cancel the event.
            */
            cancel(): void;
            /**
            * Initializes the event members.
            *
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction='direct' Equivalent to EventManager.DIRECT.
            *
            * @see eventDirection
            */
            initialize(name: string, sender: V, direction?: 'direct', eventOptions?: INavigationEventOptions<T, U>): any;
            /**
            * Initializes the event members.
            *
            * @param name The name of the event.
            * @param sender The object that initiated the event.
            * @param direction This will always be a direct event no matter what is sent in.
            *
            * @see eventDirection
            */
            initialize(name: string, sender: V, direction?: string, eventOptions?: INavigationEventOptions<T, U>): any;
        }
        /**
        * The intended external interface for the '$NavigationEventStatic' injectable.
        */
        interface INavigationEventStatic {
            /**
            * Dispatches an event with the specified target type.
            *
            * @param name The name of the event (e.g. 'beforeNavigate')
            * @param sender The object sending the event.
            * @param eventOptions An object implementing INavigationEvent, specifying what all event listeners
            * will be passed.
            */
            dispatch<T, U, V>(name: string, sender: V, eventOptions: INavigationEventOptions<T, U>): INavigationEvent<T, U, V>;
        }
        /**
        * Represents an internal Error Event. This is used for any
        * internal errors (both fatal and warnings). All error events are
        * direct events.
        */
        class ErrorEvent<T extends Error> extends DispatchEvent implements IErrorEvent<T> {
            static $EventManagerStatic: IEventManagerStatic;
            /**
            * Creates a new ErrorEvent and fires it.
            *
            * @param name The name of the event.
            * @param sender The sender of the event.
            * @param error The error that occurred, resulting in the event.
            */
            static dispatch<T extends Error>(name: string, sender: any, error: T): void;
            /**
            * The error being dispatched.
            */
            public error: T;
            /**
            * @param name The name of the event.
            * @param sender The sender of the event.
            * @param direction='direct' This is always a direct event
            * @param error The error that occurred, resulting in the event.
            */
            public initialize(name: string, sender: any, direction?: 'direct', error?: T): any;
            /**
            * @param name The name of the event.
            * @param sender The sender of the event.
            * @param direction This is always a direct event.
            * @param error The error that occurred, resulting in the event.
            */
            public initialize(name: string, sender: any, direction?: string, error?: T): any;
        }
        /**
        * The Type for referencing the '$ErrorEventStatic' injectable as a dependency.
        */
        function ErrorEventStatic($EventManagerStatic: any): typeof ErrorEvent;
        /**
        * The intended external interface for the $ErrorEventStatic injectable.
        */
        interface IErrorEventStatic {
            /**
            * Creates a new ErrorEvent and fires it.
            *
            * @param name The name of the event.
            * @param sender The sender of the event.
            * @param error The error that occurred, resulting in the event.
            */
            dispatch<T extends Error>(name: string, sender: any, error: T): void;
        }
        /**
        * Defines an object that represents an Error Event. This is used for any
        * internal errors (both fatal and warnings).
        */
        interface IErrorEvent<T extends Error> extends IDispatchEvent {
            /**
            * The error being dispatched.
            */
            error: T;
            /**
            * @param name The name of the event.
            * @param sender The sender of the event.
            * @param direction='direct' This is always a direct event
            * @param error The error that occurred, resulting in the event.
            */
            initialize(name: string, sender: any, direction?: 'direct', error?: T): any;
            /**
            * @param name The name of the event.
            * @param sender The sender of the event.
            * @param direction This is always a direct event.
            * @param error The error that occurred, resulting in the event.
            */
            initialize(name: string, sender: any, direction?: string, error?: T): any;
        }
    }
    /**
    * Used for facilitating data and DOM manipulation. Contains lifecycle events
    * as well as properties for communicating with other controls. This is the base
    * class for all types of controls.
    */
    class Control implements IControl {
        static $ContextManagerStatic: observable.IContextManagerStatic;
        static $EventManagerStatic: events.IEventManagerStatic;
        /**
        * Finds the ancestor control for the given control that contains the root
        * context.
        *
        * @static
        * @param control The control with which to find the root.
        */
        static getRootControl(control: IControl): ui.ITemplateControl;
        /**
        * Given a control, calls the loaded method for the control if it exists.
        *
        * @static
        * @param control The control to load.
        */
        static load(control: IControl): void;
        /**
        * Disposes all the necessary memory for a control. Uses specific dispose
        * methods related to a control's constructor if necessary.
        *
        * @static
        * @param control The Control to dispose.
        */
        static dispose(control: IControl): void;
        /**
        * Splices a control from its parent's controls list. Sets the control's parent
        * to null.
        *
        * @static
        * @param control The control whose parent will be removed.
        */
        static removeParent(control: IControl): void;
        private static __getControls(control, method, key);
        /**
        * A read-only unique id, created during instantiation and found on every control.
        */
        public uid: string;
        /**
        * The name of a control. This can be set using 'plat-name' in the DOM markup.
        * When a control is given a name using 'plat-name' the root control will be able to
        * access the control as a INamedElement<T extends HTMLElement, U extends ui.ITemplateControl>
        * interface on the parent. In addition, named controls can be retrieved using the
        * getControlsByName method on every control instance.
        *
        * @see {@link Control.getControlsByName}
        */
        public name: string;
        /**
        * The type of a control. The type is created when a control is registered.
        *
        * @example register.control('my-control', MyControl) // All MyControl instances will have type 'my-control'
        */
        public type: string;
        /**
        * The parent control that created this control. If this control does not implement ui.IViewControl
        * then it will inherit its context from the parent, or from plat-context when specified.
        */
        public parent: ui.ITemplateControl;
        /**
        * The HTMLElement that represents this control. Should only be modified by controls that implement
        * ui.ITemplateControl. During initialize the control should populate this element with what it wishes
        * to render to the user.
        *
        * When there is innerHTML in the element prior to instantiating the control:
        *     The element will include the innerHTML
        * When the control implements templateString or templateUrl:
        *     The serialized DOM will be auto-generated and included in the element. Any
        *     innerHTML will be stored in the innerTemplate property on the control.
        *
        * After a control is initialized its element will be compiled.
        */
        public element: HTMLElement;
        /**
        * The attributes object representing all the attributes for a control's element. All attributes are
        * converted from dash notation to camelCase.
        *
        * @see {@link ui.Attributes}
        */
        public attributes: ui.IAttributes;
        /**
        * The constructor for a control. Any injectables specified during control registration will be
        * passed into the constructor as arguments as long as the control is instantiated with its associated
        * injector.
        */
        constructor();
        /**
        * The initialize event method for a control. In this method a control should initialize all the necessary
        * variables. This method is typically only necessary for view controls. If a control does not implement
        * ui.IViewControl then it is not safe to access, observe, or modify the context property in this method.
        * A view control should call services/set context in this method in order to fire the loaded event. No control
        * will be loaded until the view control has specified a context.
        */
        public initialize(): void;
        /**
        * The loaded event method for a control. This event is fired after a control has been loaded,
        * meaning all of its children have also been loaded and initial DOM has been created and populated. It is now
        * safe for all controls to access, observe, and modify the context property.
        */
        public loaded(): void;
        /**
        * Retrieves all the controls with the specified name.
        *
        * @param name The string name with which to populate the returned controls array.
        */
        public getControlsByName(name: string): IControl[];
        /**
        * Retrieves all the controls of the specified type.
        *
        * @param type The type used to find controls (e.g. 'plat-foreach')
        * @return {Array<IControl>}
        */
        public getControlsByType<T extends Control>(type: string): T[];
        /**
        * Retrieves all the controls of the specified type.
        *
        * @param Constructor The constructor used to find controls.
        *
        * @example this.getControlsByType<ui.controls.ForEach>(ui.controls.ForEach)
        */
        public getControlsByType<T extends Control>(Constructor: new() => T): T[];
        /**
        * Parses an expression string and observes any associated identifiers. When an identifier
        * value changes, the listener will be called.
        *
        * @param expression The expression string to watch for changes.
        * @param listener The listener to call when the expression identifer values change.
        */
        public observeExpression(expression: string, listener: (value: any, oldValue: any) => void): IRemoveListener;
        /**
        * Uses a parsed expression to observe any associated identifiers. When an identifier
        * value changes, the listener will be called.
        *
        * @param expression The IParsedExpression to watch for changes.
        * @param listener The listener to call when the expression identifer values change.
        */
        public observeExpression(expression: expressions.IParsedExpression, listener: (value: any, oldValue: any) => void): IRemoveListener;
        /**
        * Evaluates an expression string, using the control.context.
        *
        * @param expression The expression string to evaluate.
        * @param context An optional context with which to parse. If
        * no context is specified, the control.context will be used.
        */
        public evaluateExpression(expression: string, context?: any): any;
        /**
        * Evaluates a parsed expression, using the control.context.
        *
        * @param expression The IParsedExpression to evaluate.
        * @param context An optional context with which to parse. If
        * no context is specified, the control.context will be used.
        */
        public evaluateExpression(expression: expressions.IParsedExpression, context?: any): any;
        /**
        * Creates a new DispatchEvent and propagates it to controls based on the
        * provided direction mechanism. Controls in the propagation chain that registered
        * the event using the control.on() method will receive the event. Propagation will
        * always start with the sender, so the sender can both produce and consume the same
        * event.
        *
        * @param name The name of the event to send, cooincides with the name used in the
        * control.on() method.
        * @param direction An optional events.eventDirection to propagate the event, defaults to
        * events.EventManager.UP.
        * @param ...args Any number of arguments to send to all the listeners.
        *
        * @see events.eventDirection
        */
        public dispatchEvent(name: string, direction?: string, ...args: any[]): any;
        /**
        * Creates a new DispatchEvent and propagates it to controls based on the
        * provided direction mechanism. Controls in the propagation chain that registered
        * the event using the control.on() method will receive the event. Propagation will
        * always start with the sender, so the sender can both produce and consume the same
        * event.
        *
        * @param name The name of the event to send, cooincides with the name used in the
        * control.on() method.
        * @param direction='up' Equivalent to events.EventManager.UP
        * @param ...args Any number of arguments to send to all the listeners.
        *
        * @see events.eventDirection
        */
        public dispatchEvent(name: string, direction?: 'up', ...args: any[]): any;
        /**
        * Creates a new DispatchEvent and propagates it to controls based on the
        * provided direction mechanism. Controls in the propagation chain that registered
        * the event using the control.on() method will receive the event. Propagation will
        * always start with the sender, so the sender can both produce and consume the same
        * event.
        *
        * @param name The name of the event to send, cooincides with the name used in the
        * control.on() method.
        * @param direction='down' Equivalent to events.EventManager.DOWN
        * @param ...args Any number of arguments to send to all the listeners.
        *
        * @see events.eventDirection
        */
        public dispatchEvent(name: string, direction?: 'down', ...args: any[]): any;
        /**
        * Creates a new DispatchEvent and propagates it to controls based on the
        * provided direction mechanism. Controls in the propagation chain that registered
        * the event using the control.on() method will receive the event. Propagation will
        * always start with the sender, so the sender can both produce and consume the same
        * event.
        *
        * @param name The name of the event to send, cooincides with the name used in the
        * control.on() method.
        * @param direction='direct' Equivalent to events.EventManager.DIRECT
        * @param ...args Any number of arguments to send to all the listeners.
        *
        * @see events.eventDirection
        */
        public dispatchEvent(name: string, direction?: 'direct', ...args: any[]): any;
        /**
        * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is
        * propagating over the control. Any number of listeners can exist for a single event name.
        *
        * @param name The name of the event, cooinciding with the DispatchEvent name.
        * @param listener The method called when the DispatchEvent is fired.
        */
        public on(name: string, listener: (ev: events.IDispatchEvent, ...args: any[]) => void): IRemoveListener;
        /**
        * Registers a listener for a routeChange event. The listener will be called when a routeChange event
        * is propagating over the control. Any number of listeners can exist for a single event name.
        *
        * @param eventName='routeChange' This specifies that the listener is for a routeChange event.
        * @param listener The method called when the routeChange is fired. The route argument will contain
        * a parsed route.
        */
        public on(name: 'routeChange', listener: (ev: events.IDispatchEvent, route: web.IRoute<any>) => void): IRemoveListener;
        /**
        * The dispose event is called when a control is being removed from memory. A control should release
        * all of the memory it is using, including DOM event and property listeners.
        */
        public dispose(): void;
    }
    /**
    * The Type for referencing the '$ControlStatic' injectable as a dependency.
    */
    function ControlStatic($ContextManagerStatic: any, $EventManagerStatic: any): typeof Control;
    interface IControlStatic {
        /**
        * Finds the ancestor control for the given control that contains the root
        * context.
        *
        * @static
        * @param control The control with which to find the root.
        * @return {ui.ITemplateControl}
        */
        getRootControl(control: IControl): ui.ITemplateControl;
        getRootControl(control: ui.ITemplateControl): ui.ITemplateControl;
        /**
        * Given a control, calls the loaded method for the control if it exists.
        *
        * @static
        * @param control The control to load.
        */
        load(control: IControl): void;
        /**
        * Disposes all the necessary memory for a control. Uses specific dispose
        * methods related to a control's constructor if necessary.
        *
        * @static
        * @param control The Control to dispose.
        */
        dispose(control: IControl): void;
        /**
        * Splices a control from its parent's controls list. Sets the control's parent
        * to null.
        *
        * @static
        * @param control The control whose parent will be removed.
        */
        removeParent(control: IControl): void;
        /**
        * Create a new empty IControl
        */
        new(): IControl;
    }
    /**
    * Describes an object used for facilitating data and DOM manipulation. Contains lifecycle events
    * as well as properties for communicating with other IControls.
    */
    interface IControl {
        /**
        * A unique id, created during instantiation and found on every IControl.
        */
        uid: string;
        /**
        * The name of an IControl.
        */
        name?: string;
        /**
        * The type of an IControl.
        */
        type?: string;
        /**
        * The parent control that created this control. If this control does not implement ui.IViewControl
        * then it will inherit its context from the parent.
        */
        parent?: ui.ITemplateControl;
        /**
        * The HTMLElement that represents this IControl. Should only be modified by controls that implement
        * ui.ITemplateControl. During initialize the control should populate this element with what it wishes
        * to render to the user.
        *
        * When there is innerHTML in the element prior to instantiating the control:
        *     The element will include the innerHTML
        * When the control implements templateString or templateUrl:
        *     The serialized DOM will be auto-generated and included in the element. Any
        *     innerHTML will be stored in the innerTemplate property on the control.
        *
        * After an IControl is initialized its element will be compiled.
        */
        element?: HTMLElement;
        /**
        * The attributes object representing all the attributes for an IControl's element. All attributes are
        * converted from dash notation to camelCase.
        *
        * @see {@link ui.Attributes}
        */
        attributes?: ui.IAttributes;
        /**
        * The initialize event method for a control. In this method a control should initialize all the necessary
        * variables. This method is typically only necessary for view controls. If a control does not implement
        * ui.IViewControl then it is not safe to access, observe, or modify the context property in this method.
        * A view control should call services/set context in this method in order to fire the loaded event. No control
        * will be loaded until the view control has specified a context.
        */
        initialize? (): void;
        /**
        * The loaded event method for a control. This event is fired after a control has been loaded,
        * meaning all of its children have also been loaded and initial DOM has been created and populated. It is now
        * safe for all controls to access, observe, and modify the context property.
        */
        loaded? (): void;
        /**
        * Retrieves all the controls with the specified name.
        *
        * @param name The string name with which to populate the returned controls array.
        */
        getControlsByName? (name: string): IControl[];
        /**
        * Retrieves all the controls of the specified type.
        *
        * @param type The type used to find controls (e.g. 'plat-foreach')
        */
        getControlsByType? <T extends IControl>(type: string): T[];
        /**
        * Retrieves all the controls of the specified type.
        *
        * @param Constructor The constructor used to find controls.
        *
        * @example this.getControlsByType<ui.controls.ForEach>(ui.controls.ForEach)
        */
        getControlsByType? <T extends IControl>(Constructor: new() => T): T[];
        /**
        * Parses an expression string and observes any associated identifiers. When an identifier
        * value changes, the listener will be called.
        *
        * @param expression The expression string to watch for changes.
        * @param listener The listener to call when the expression identifer values change.
        */
        observeExpression(expression: string, listener: (value: any, oldValue: any) => void): IRemoveListener;
        /**
        * Uses a parsed expression to observe any associated identifiers. When an identifier
        * value changes, the listener will be called.
        *
        * @param expression The IParsedExpression to watch for changes.
        * @param listener The listener to call when the expression identifer values change.
        */
        observeExpression(expression: expressions.IParsedExpression, listener: (value: any, oldValue: any) => void): IRemoveListener;
        /**
        * Evaluates an expression string, using the control.context.
        *
        * @param expression The expression string to evaluate.
        * @param context An optional context with which to parse. If
        * no context is specified, the control.context will be used.
        */
        evaluateExpression(expression: string, context?: any): any;
        /**
        * Evaluates a parsed expression, using the control.context.
        *
        * @param expression The IParsedExpression to evaluate.
        * @param context An optional context with which to parse. If
        * no context is specified, the control.context will be used.
        */
        evaluateExpression(expression: expressions.IParsedExpression, context?: any): any;
        /**
        * Creates a new DispatchEvent and propagates it to controls based on the
        * provided direction mechanism. Controls in the propagation chain that registered
        * the event using the control.on() method will receive the event. Propagation will
        * always start with the sender, so the sender can both produce and consume the same
        * event.
        *
        * @param name The name of the event to send, cooincides with the name used in the
        * control.on() method.
        * @param direction='up' Equivalent to events.EventManager.UP
        * @param ...args Any number of arguments to send to all the listeners.
        *
        * @see events.eventDirection
        */
        dispatchEvent(name: string, direction?: 'up', ...args: any[]): any;
        /**
        * Creates a new DispatchEvent and propagates it to controls based on the
        * provided direction mechanism. Controls in the propagation chain that registered
        * the event using the control.on() method will receive the event. Propagation will
        * always start with the sender, so the sender can both produce and consume the same
        * event.
        *
        * @param name The name of the event to send, cooincides with the name used in the
        * control.on() method.
        * @param direction='down' Equivalent to events.EventManager.DOWN
        * @param ...args Any number of arguments to send to all the listeners.
        *
        * @see events.eventDirection
        */
        dispatchEvent(name: string, direction?: 'down', ...args: any[]): any;
        /**
        * Creates a new DispatchEvent and propagates it to controls based on the
        * provided direction mechanism. Controls in the propagation chain that registered
        * the event using the control.on() method will receive the event. Propagation will
        * always start with the sender, so the sender can both produce and consume the same
        * event.
        *
        * @param name The name of the event to send, cooincides with the name used in the
        * control.on() method.
        * @param direction='direct' Equivalent to events.EventManager.DIRECT
        * @param ...args Any number of arguments to send to all the listeners.
        *
        * @see events.eventDirection
        */
        dispatchEvent(name: string, direction?: 'direct', ...args: any[]): any;
        /**
        * Creates a new DispatchEvent and propagates it to controls based on the
        * provided direction mechanism. Controls in the propagation chain that registered
        * the event using the control.on() method will receive the event. Propagation will
        * always start with the sender, so the sender can both produce and consume the same
        * event.
        *
        * @param name The name of the event to send, cooincides with the name used in the
        * control.on() method.
        * @param direction An optional events.eventDirection to propagate the event, defaults to
        * events.EventManager.UP.
        * @param ...args Any number of arguments to send to all the listeners.
        *
        * @see events.eventDirection
        */
        dispatchEvent(name: string, direction?: string, ...args: any[]): any;
        /**
        * Registers a listener for a routeChange event. The listener will be called when a routeChange event
        * is propagating over the control. Any number of listeners can exist for a single event name.
        *
        * @param eventName='routeChange' This specifies that the listener is for a routeChange event.
        * @param listener The method called when the routeChange is fired. The route argument will contain
        * a parsed route.
        */
        on(name: 'routeChange', listener: (ev: events.IDispatchEvent, route: web.IRoute<any>) => void): IRemoveListener;
        /**
        * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is
        * propagating over the control. Any number of listeners can exist for a single event name.
        *
        * @param name The name of the event, cooinciding with the DispatchEvent name.
        * @param listener The method called when the DispatchEvent is fired.
        */
        on(name: string, listener: (ev: events.IDispatchEvent, ...args: any[]) => void): IRemoveListener;
        /**
        * The dispose event is called when a control is being removed from memory. A control should release
        * all of the memory it is using, including DOM event and property listeners.
        */
        dispose? (): void;
    }
    module controls {
        /**
        * A type of control that can be used as an attribute but will
        * not be used to add, remove, or modify DOM.
        */
        class AttributeControl extends Control implements IAttributeControl {
            /**
            * Method for disposing an attribute control. Removes any
            * necessary objects from the control.
            *
            * @static
            * @param control The AttributeControl to dispose.
            */
            static dispose(control: IAttributeControl): void;
            /**
            * Specifies the ITemplateControl associated with this
            * control's element. Can be null if no ITemplateControl
            * exists.
            */
            public templateControl: ui.ITemplateControl;
            /**
            * Specifies the priority of the attribute. The purpose of
            * this is so that controls like plat-bind can have a higher
            * priority than plat-tap. The plat-bind will be initialized
            * and loaded before plat-tap, meaning it has the first chance
            * to respond to events.
            */
            public priority: number;
        }
        /**
        * The Type for referencing the '$AttributeControlStatic' injectable as a dependency.
        */
        function AttributeControlStatic($ControlStatic: any): typeof AttributeControl;
        /**
        * An object describing a type of control that can be used as an attribute but will
        * not be used to add, remove, or modify DOM.
        */
        interface IAttributeControl extends IControl {
            /**
            * Specifies the ITemplateControl associated with this
            * control's element. Can be null if no ITemplateControl
            * exists.
            */
            templateControl: ui.ITemplateControl;
            /**
            * Specifies the priority of the attribute. The purpose of
            * this is so that controls like plat-bind can have a higher
            * priority than plat-tap. The plat-bind will be initialized
            * and loaded before plat-tap, meaning it has the first chance
            * to respond to events.
            */
            priority: number;
        }
        /**
        * The external interface for the '$AttributeControlStatic' injectable.
        */
        interface IAttributeControlStatic {
            /**
            * Method for disposing an attribute control. Removes any
            * necessary objects from the control.
            *
            * @static
            * @param control The AttributeControl to dispose.
            */
            dispose(control: IAttributeControl): void;
            /**
            * Create a new empty IAttributeControl
            */
            new(): IAttributeControl;
        }
        class Name extends AttributeControl {
            public $ContextManagerStatic: observable.IContextManagerStatic;
            public $ExceptionStatic: IExceptionStatic;
            /**
            * The root control that will have the INamedElement set as a property.
            */
            public _rootControl: ui.ITemplateControl;
            /**
            * The property name on the root control to set as the INamedElement.
            */
            public _label: string;
            /**
            * Finds the root control and defines the property specified by the
            * attribute value as the INamedElement.
            */
            public initialize(): void;
            /**
            * Removes the INamedElement from the root control.
            */
            public dispose(): void;
        }
        /**
        * Defines the object added to a root control when an HTML element has
        * a plat-name attribute. If the element corresponds to a registered
        * control, the control will be included in the object.
        */
        interface INamedElement<T extends HTMLElement, U> {
            /**
            * The element on which the plat-name is specified.
            */
            element: T;
            /**
            * The template control on the associated element, if one
            * exists.
            */
            control?: U;
        }
        /**
        * An AttributeControl that binds to a specified DOM event handler.
        */
        class SimpleEventControl extends AttributeControl implements ISimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
            /**
            * The camel-cased name of the control as it appears as an attribute.
            */
            public attribute: string;
            /**
            * Our event handler bound to our own context.
            */
            public _listener: any;
            /**
            * A parsed form of the expression found in the attribute's value.
            */
            public _expression: string[];
            /**
            * An array of the aliases used in the expression.
            */
            public _aliases: string[];
            public $parser: expressions.IParser;
            public $regex: expressions.IRegex;
            public $ExceptionStatic: IExceptionStatic;
            /**
            * Kicks off finding and setting the listener.
            */
            public loaded(): void;
            /**
            * Disposes of the event listener.
            */
            public dispose(): void;
            /**
            * Adds the event listener to the element.
            */
            public _addEventListener(): void;
            /**
            * Sets the event listener.
            */
            public _setListener(): void;
            /**
            * Finds the first instance of the specified function
            * in the parent control chain.
            *
            * @param identifier the function identifer
            */
            public _findListener(identifier: string): {
                control: IControl;
                value: any;
            };
            /**
            * Constructs the function to evaluate with
            * the evaluated arguments taking resources
            * into account.
            */
            public _buildExpression(): {
                fn: any;
                control: any;
                args: any[];
            };
            /**
            * Calls the specified function when the DOM event is fired.
            *
            * @param ev The event object.
            */
            public _onEvent(ev: any): void;
            /**
            * Finds all alias contained within the expression.
            *
            * @param arguments The array of arguments as strings.
            */
            public _findAliases(arguments: string[]): string[];
            /**
            * Parses the expression and separates the function
            * from its arguments.
            *
            * @param expression The expression to parse.
            */
            public _parseArgs(expression: string): void;
        }
        /**
        * Describes an attribute object that deals with DOM events.
        */
        interface ISimpleEventControl extends IAttributeControl {
            /**
            * The event name.
            */
            event: string;
            /**
            * The camel-cased name of the control as it appears as an attribute.
            */
            attribute: string;
        }
        class Tap extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Blur extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Change extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Copy extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Cut extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Paste extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Dbltap extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Focus extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Mouseenter extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Mouseleave extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Mousedown extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Mouseup extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Mouseover extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Mousemove extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Submit extends SimpleEventControl {
            /**
            * The event name.
            */
            public event: string;
            /**
            * Prevents the default submit action unless
            * the "action" attribute is present.
            *
            * @param ev The event object.
            */
            public _onEvent(ev: Event): void;
        }
        var KeyCodes: {
            'backspace': number;
            'tab': number;
            'enter': number;
            'shift': number;
            'ctrl': number;
            'alt': number;
            'pause': number;
            'break': number;
            'caps lock': number;
            'escape': number;
            'space': number;
            'page up': number;
            'page down': number;
            'end': number;
            'home': number;
            'left': number;
            'left arrow': number;
            'up': number;
            'up arrow': number;
            'right': number;
            'right arrow': number;
            'down': number;
            'down arrow': number;
            'insert': number;
            'delete': number;
            '0': number;
            'zero': number;
            ')': number;
            'right parenthesis': number;
            '1': number;
            'one': number;
            '!': number;
            'exclamation': number;
            'exclamation point': number;
            '2': number;
            'two': number;
            '@': number;
            'at': number;
            '3': number;
            'three': number;
            '#': number;
            'number sign': number;
            'hash': number;
            'pound': number;
            '4': number;
            'four': number;
            '$': number;
            'dollar': number;
            'dollar sign': number;
            '5': number;
            'five': number;
            '%': number;
            'percent': number;
            'percent sign': number;
            '6': number;
            'six': number;
            '^': number;
            'caret': number;
            '7': number;
            'seven': number;
            '&': number;
            'ampersand': number;
            '8': number;
            'eight': number;
            '*': number;
            'asterisk': number;
            '9': number;
            'nine': number;
            '(': number;
            'left parenthesis': number;
            'a': number;
            'b': number;
            'c': number;
            'd': number;
            'e': number;
            'f': number;
            'g': number;
            'h': number;
            'i': number;
            'j': number;
            'k': number;
            'l': number;
            'm': number;
            'n': number;
            'o': number;
            'p': number;
            'q': number;
            'r': number;
            's': number;
            't': number;
            'u': number;
            'v': number;
            'w': number;
            'x': number;
            'y': number;
            'z': number;
            'lwk': number;
            'left window key': number;
            'rwk': number;
            'right window key': number;
            'select': number;
            'select key': number;
            'numpad 0': number;
            'numpad 1': number;
            'numpad 2': number;
            'numpad 3': number;
            'numpad 4': number;
            'numpad 5': number;
            'numpad 6': number;
            'numpad 7': number;
            'numpad 8': number;
            'numpad 9': number;
            'multiply': number;
            'add': number;
            'subtract': number;
            'decimal point': number;
            'divide': number;
            'f1': number;
            'f2': number;
            'f3': number;
            'f4': number;
            'f5': number;
            'f6': number;
            'f7': number;
            'f8': number;
            'f9': number;
            'f10': number;
            'f11': number;
            'f12': number;
            'num lock': number;
            'scroll lock': number;
            ';': number;
            'semi-colon': number;
            ':': number;
            'colon': number;
            '=': number;
            'equal': number;
            'equal sign': number;
            '+': number;
            'plus': number;
            ',': number;
            'comma': number;
            '<': number;
            'lt': number;
            'less than': number;
            'left angle bracket': number;
            '-': number;
            'dash': number;
            '_': number;
            'underscore': number;
            '.': number;
            'period': number;
            '>': number;
            'gt': number;
            'greater than': number;
            'right angle bracket': number;
            '/': number;
            'forward slash': number;
            '?': number;
            'question mark': number;
            '`': number;
            'grave accent': number;
            '~': number;
            'tilde': number;
            '[': number;
            'open bracket': number;
            '{': number;
            'open brace': number;
            '\\': number;
            'back slash': number;
            '|': number;
            'pipe': number;
            ']': number;
            'close bracket': number;
            '}': number;
            'close brace': number;
            '\'': number;
            'single quote': number;
            '"': number;
            'double quote': number;
        };
        class KeyCodeEventControl extends SimpleEventControl implements IKeyCodeEventControl {
            /**
            * An object keyed by keyCode with options as key values.
            */
            public keyCodes: IObject<{
                shifted?: boolean;
            }>;
            /**
            * Checks if the IKeyboardEventInput is an expression object
            * and sets the necessary listener.
            */
            public _setListener(): void;
            /**
            * Matches the event's keyCode if necessary and then handles the event if
            * a match is found or if there are no filter keyCodes.
            *
            * @param ev The keyboard event object.
            */
            public _onEvent(ev: KeyboardEvent): void;
            /**
            * Sets the defined key codes as they correspond to
            * the KeyCodes map.
            *
            * @param keys The array of defined keys to satisfy the
            * key press condition.
            */
            public _setKeyCodes(keys?: string[]): void;
        }
        /**
        * Describes an attribute object that binds to specified key code scenarios.
        */
        interface IKeyCodeEventControl extends ISimpleEventControl {
            /**
            * An object keyed by keyCode with options as key values.
            */
            keyCodes: IObject<{
                shifted?: boolean;
            }>;
        }
        /**
        * The available options for plat.controls.KeyCodeEventControl.
        */
        interface IKeyboardEventInput {
            /**
            * The method to call when the
            * condition is satisfied.
            */
            method: string;
            /**
            * The key to satisfy the press
            * condition. Can be specified
            * either as a numeric key code
            * or a string representation
            * as seen by the KeyCodes mapping.
            */
            key?: string;
            /**
            * An optional array of keys
            * if more than one key can
            * satisfy the condition.
            */
            keys?: string[];
        }
        class Keydown extends KeyCodeEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        class Keypress extends KeyCodeEventControl {
            /**
            * The event name.
            */
            public event: string;
            /**
            * Filters only 'printing keys' (a-z, 0-9, and special characters)
            *
            * @param ev The keyboard event object.
            */
            public _onEvent(ev: KeyboardEvent): void;
        }
        class Keyup extends KeyCodeEventControl {
            /**
            * The event name.
            */
            public event: string;
        }
        /**
        * An AttributeControl that deals with binding to a specified property on its element.
        */
        class SetAttributeControl extends AttributeControl implements ISetAttributeControl {
            /**
            * The corresponding attribute to set on the element.
            */
            public property: string;
            /**
            * The camel-cased name of the control as it appears as an attribute.
            */
            public attribute: string;
            /**
            * The function for removing the attribute changed listener.
            */
            private __removeListener;
            /**
            * Sets the corresponding attribute {property} value and
            * observes the attribute for changes.
            */
            public loaded(): void;
            /**
            * Resets the corresponding attribute {property} value upon
            * a change of context.
            */
            public contextChanged(): void;
            /**
            * Stops listening to attribute changes.
            */
            public dispose(): void;
            /**
            * The function for setting the corresponding
            * attribute {property} value.
            */
            public setter(): void;
        }
        /**
        * Describes an attribute object that deals with binding to a specified property.
        */
        interface ISetAttributeControl extends IAttributeControl {
            /**
            * The corresponding attribute to set on the element.
            */
            property: string;
            /**
            * The camel-cased name of the control as it appears as an attribute.
            */
            attribute: string;
            /**
            * The function for setting the corresponding
            * attribute {property} value.
            */
            setter(): void;
        }
        class Checked extends SetAttributeControl {
            public property: string;
        }
        class Disabled extends SetAttributeControl {
            public property: string;
        }
        class Selected extends SetAttributeControl {
            public property: string;
        }
        class Readonly extends SetAttributeControl {
            public property: string;
        }
        class Open extends SetAttributeControl {
            public property: string;
        }
        class Visible extends SetAttributeControl {
            private __initialDisplay;
            /**
            * Obtains the initial visibility of the item
            * based on it's initial display.
            */
            public initialize(): void;
            /**
            * Evaluates boolean expression and sets the display.
            */
            public setter(): void;
        }
        class Style extends SetAttributeControl {
            /**
            * Sets the evaluated styles on the element.
            */
            public setter(): void;
        }
        class ElementPropertyControl extends SetAttributeControl {
            /**
            * The function for setting the corresponding
            * attribute {property} value to the evaluated expression.
            */
            public setter(): void;
        }
        class Href extends ElementPropertyControl {
            /**
            * The corresponding attribute to set on the element.
            */
            public property: string;
            public $browserConfig: web.IBrowserConfig;
            public $browser: web.IBrowser;
            public element: HTMLAnchorElement;
            public loaded(): void;
        }
        class Src extends ElementPropertyControl {
            /**
            * The corresponding attribute to set on the element.
            */
            public property: string;
        }
        class Srcset extends ElementPropertyControl {
            /**
            * The corresponding attribute to set on the element.
            */
            public property: string;
        }
        class Value extends ElementPropertyControl {
            /**
            * The corresponding attribute to set on the element.
            */
            public property: string;
        }
        class Bind extends AttributeControl {
            /**
            * The priority of Bind is set high to take precede
            * other controls that may be listening to the same
            * event.
            */
            public priority: number;
            public $parser: expressions.IParser;
            public $ExceptionStatic: IExceptionStatic;
            /**
            * The function used to add the proper event based on the input type.
            */
            public _addEventType: () => void;
            /**
            * The function used to get the bound value.
            */
            public _getter: any;
            /**
            * The function used to set the bound value.
            */
            public _setter: any;
            /**
            * An array of functions to remove the event listeners attached
            * to this element.
            */
            public _removeEventListeners: IRemoveListener[];
            /**
            * The event listener attached to this element.
            */
            public _eventListener: () => void;
            /**
            * The event listener as a postponed function.
            */
            public _postponedEventListener: () => void;
            /**
            * The expression to evaluate as the bound value.
            */
            public _expression: expressions.IParsedExpression;
            /**
            * The IParsedExpression used to evaluate the context
            * of the bound property.
            */
            public _contextExpression: expressions.IParsedExpression;
            /**
            * The bound property name.
            */
            public _property: string;
            /**
            * Determines the type of HTMLElement being bound to
            * and sets the necessary handlers.
            */
            public initialize(): void;
            /**
            * Parses and watches the expression being bound to.
            */
            public loaded(): void;
            /**
            * Re-observes the expression with the new context.
            */
            public contextChanged(): void;
            /**
            * Removes all of the element's event listeners.
            */
            public dispose(): void;
            /**
            * Adds a text event as the event listener.
            * Used for textarea and input[type=text].
            */
            public _addTextEventListener(): void;
            /**
            * Adds a change event as the event listener.
            * Used for select, input[type=radio], and input[type=range].
            */
            public _addChangeEventListener(): void;
            /**
            * Adds the event listener to the element.
            *
            * @param event The event type
            * @param listener The event listener
            * @param postpone Whether or not to postpone the event listener
            */
            public _addEventListener(event: string, listener?: () => void, postpone?: boolean): void;
            /**
            * Getter for input[type=checkbox] and input[type=radio]
            */
            public _getChecked(): boolean;
            /**
            * Getter for input[type=text], input[type=range],
            * textarea, and select.
            */
            public _getValue(): string;
            /**
            * Setter for textarea, input[type=text],
            * and input[type=button]
            *
            * @param newValue The new value to set
            */
            public _setText(newValue: any): void;
            /**
            * Setter for input[type=range]
            *
            * @param newValue The new value to set
            */
            public _setRange(newValue: any): void;
            /**
            * Setter for input[type=checkbox] and input[type=radio]
            *
            * @param newValue The new value to set
            */
            public _setChecked(newValue: any): void;
            /**
            * Setter for select
            *
            * @param newValue The new value to set
            */
            public _setSelectedIndex(newValue: any): void;
            /**
            * Determines the type of HTMLElement being bound to
            * and sets the necessary handlers.
            */
            public _determineType(): void;
            /**
            * Observes the expression to bind to.
            */
            public _watchExpression(): void;
            /**
            * Pushes a new function for removing a newly added
            * event listener.
            *
            * @param event The event type
            * @param listener The event listener
            */
            public _pushRemoveEventListener(event: string, listener: () => void): void;
            /**
            * Sets the context property being bound to when the
            * element's property is changed.
            */
            public _propertyChanged(): void;
            private __setValue(newValue);
        }
        /**
        * An AttributeControl that deals with observing changes for a specified property.
        */
        class ObservableAttributeControl extends AttributeControl implements IObservableAttributeControl {
            /**
            * The property to set on the associated template control.
            */
            public property: string;
            /**
            * The camel-cased name of the control as it appears as an attribute.
            */
            public attribute: string;
            /**
            * The set of functions added by the Template Control that listens
            * for property changes.
            */
            public _listeners: {
                (newValue: any, oldValue: any): void;
            }[];
            /**
            * A function for adding listeners.
            */
            public _boundAddListener: any;
            /**
            * The function to stop listening for property changes.
            */
            public _removeListener: IRemoveListener;
            /**
            * Sets the initial value of the property on
            * the Template Control.
            */
            public initialize(): void;
            /**
            * Observes the property and resets the value.
            */
            public loaded(): void;
            /**
            * Stops listening for changes to the evaluated
            * expression and removes references to the listeners
            * defined by the Template Control.
            */
            public dispose(): void;
            /**
            * Sets the property on the Template Control.
            *
            * @param value The new value of the evaluated expression.
            * @param oldValue The old value of the evaluated expression.
            */
            public _setProperty(value: any, oldValue?: any): void;
            /**
            * Calls the listeners defined by the Template Control.
            *
            * @param value The new value of the evaluated expression.
            * @param oldValue The old value of the evaluated expression.
            */
            public _callListeners(newValue: any, oldValue: any): void;
            /**
            * Adds a listener as defined by the Template Control.
            *
            * @param listener The listener added by the Template Control.
            */
            public _addListener(listener: (newValue: any, oldValue: any) => void): IRemoveListener;
            /**
            * Evaluates the attribute's value.
            */
            public _getValue(): any;
            /**
            * Observes the attribute's value.
            */
            public _observeProperty(): void;
        }
        /**
        * Describes an attribute object that deals with observing changes for a specified property.
        */
        interface IObservableAttributeControl extends IAttributeControl {
            /**
            * The property to set on the associated template control.
            */
            property: string;
        }
        class Options extends ObservableAttributeControl {
            /**
            * The property to set on the associated template control.
            */
            public property: string;
        }
    }
    module ui {
        /**
        * A control class which provides properties and methods for managing its body HTML.
        */
        class TemplateControl extends Control implements ITemplateControl {
            /**
            * Evaluates an expression string with a given control and optional context.
            *
            * @param expression The expression string (e.g. 'foo + foo').
            * @param control The control used for evaluation context.
            * @param aliases An optional alias object containing resource alias values
            */
            static evaluateExpression(expression: string, control?: ITemplateControl, aliases?: any): any;
            /**
            * Evaluates a parsed expression with a given control and optional context.
            *
            * @param expression An IParsedExpression created using the '$parser' injectable.
            * @param control The control used for evaluation context.
            * @param aliases An optional alias object containing resource alias values
            */
            static evaluateExpression(expression: expressions.IParsedExpression, control?: ITemplateControl, aliases?: any): any;
            /**
            * Given a control and Array of aliases, finds the associated resources and builds a context object containing
            * the values. Returns the object.
            *
            * @param control The control used as the starting point for finding resources.
            * @param aliases An array of aliases to search for.
            * @param resources An optional resources object to extend, if no resources object is passed in a new one will be created.
            */
            static getResources(control: ITemplateControl, aliases: string[], resources?: any): any;
            /**
            * Starts at a control and searches up its parent chain for a particular resource alias.
            * If the resource is found, it will be returned along with the control instance on which
            * the resource was found.
            *
            * @param control The control on which to start searching for the resource alias.
            * @param alias The alias to search for.
            */
            static findResource(control: ITemplateControl, alias: string): {
                resource: any;
                control: ITemplateControl;
            };
            /**
            * Recursively disposes a control and its children.
            * @static
            * @param control A control to dispose.
            */
            static dispose(control: ITemplateControl): void;
            /**
            * Loads the control tree depth first (visit children, then visit self).
            *
            * @static
            * @param control The control serving as the root control to load.
            */
            static loadControl(control: ITemplateControl): void;
            /**
            * Notifies a control that its context has been changed by
            * calling the control.contextChanged method if it exists.
            *
            * @param control The control whose context changed.
            * @param newValue The new value of the control's context.
            * @param oldValue The old value of the control's context.
            */
            static contextChanged(control: IControl, newValue: any, oldValue: any): any;
            /**
            * Sets the 'context' resource value on a template control. If the control specifies
            * hasOwnContext, the 'rootContext' resource value will be set.
            *
            * @param control The control whose context resources will be set.
            */
            static setContextResources(control: ITemplateControl): void;
            /**
            * Completely removes a control's element from its parentNode. If the
            * control implements replaceWith=null, All of its nodes between its
            * startNode and endNode (inclusive) will be removed.
            *
            * @param control The control whose element should be removed.
            */
            static removeElement(control: ITemplateControl): void;
            /**
            * Sets the absoluteContextPath read-only property on a control.
            *
            * @param control The control on which to set the absoluteContextPath.
            * @param path The path to set on the control.
            */
            static setAbsoluteContextPath(control: ITemplateControl, path: string): void;
            /**
            * Determines the template for a control by searching for a templateUrl,
            * using the provided templateUrl, or serializing the control's templateString.
            */
            static determineTemplate(control: ITemplateControl, templateUrl?: string): any;
            /**
            * Detaches a TemplateControl. Disposes its children, but does not dispose the TemplateControl.
            *
            * @static
            * @param control The control to be detached.
            */
            static detach(control: ITemplateControl): void;
            private static __resourceCache;
            /**
            * Specifies the absolute path from where the context was created to this control's context.
            * Used by the ContextManager for maintaining context parity.
            *
            * @example 'context.childContextProperty.grandChildContextProperty'
            */
            public absoluteContextPath: string;
            /**
            * The inherited singleton object used for data-binding. A control that implements IViewControl will
            * create the context object for all of its children. Any properties bound in the DOM markup will be
            * initialized to NULL automatically. If a control does not implement IViewControl it cannot
            * directly modify the context property, and it should only modify child properties off of context.
            */
            public context: any;
            /**
            * Resources are used for providing aliases to use in markup expressions. They
            * are particularly useful when trying to access properties outside of the
            * current context, as well as reassigning context at any point in an app.
            *
            * By default, every control has a resource for '@control' and '@context'.
            * IViewControl objects also have a resource for '@root' and '@rootContext', which is a reference
            * to their root control and root context.
            *
            * Resources can be created in HTML, or through the exposed control.resources
            * object. If specified in HTML, they must be the first element child of the
            * control upon which the resources will be placed. IViewControls that use a
            * templateUrl can have resources as their first element in the templateUrl.
            *
            * @example
            * <custom-control>
            *     <plat-resources>
            *         <injectable alias="Cache">$CacheStatic</injectable>
            *         <observable alias="testObj">
            *              {
            *                  foo: 'foo',
            *                  bar: 'bar',
            *                  baz: 2
            *              }
            *         </observable>
            *     </plat-resources>
            * </custom-control>
            *
            * In the above example, the resources can be accessed by using '@Cache' and '@testObj'.
            * The type of resource is denoted by the element name.
            *
            * Only resources of type 'observable' will have data binding. The types of resources are:
            * function, injectable, observable, and object. Resources of type 'function' will have their
            * associated function context bound to the control that contains the resource.
            *
            * When an alias is found in a markup expression, the framework will search up the control chain
            * to find the alias on a control's resources. This first matching alias will be used.
            */
            public resources: IResources;
            /**
            * Indicates whether or not this control defines its own context. Controls that implement
            * IViewControl will automatically implement this flag as true.
            */
            public hasOwnContext: boolean;
            /**
            * A string representing the DOM template for this control. If this property is
            * defined on a ITemplateControl then DOM will be created and put in the
            * control's element prior to calling the 'setTemplate' method.
            */
            public templateString: string;
            /**
            * A url containing a string representing the DOM template for this control. If this property is
            * defined on a ITemplateControl then DOM will be created and put in the
            * control's element prior to calling the 'setTemplate' method. This property takes
            * precedence over templateString. In the event that both are defined, templateString
            * will be ignored.
            */
            public templateUrl: string;
            /**
            * A DocumentFragment representing the innerHTML that existed when this control was instantiated.
            * This property will only contain the innerHTML when either a templateString or templateUrl is
            * defined.
            */
            public innerTemplate: DocumentFragment;
            /**
            * A IBindableTemplates object used for binding a data context to a template. This is an
            * advanced function of a ITemplateControl.
            *
            * @see IBindableTemplates
            */
            public bindableTemplates: IBindableTemplates;
            /**
            * An array of child controls. Any controls created by this control can be found in this array. The controls in
            * this array will have reference to this control in their parent property.
            */
            public controls: IControl[];
            /**
            * A Node array for managing the ITemplateControl's childNodes in the event that this control
            * replaces its element. This property will only be useful for a ITemplateControl that implements
            * replaceWith = null.
            */
            public elementNodes: Node[];
            /**
            * The first node in the ITemplateControl's body. This property will be a Comment node when the
            * control implements replaceWith = null, otherwise it will be null. This property allows a ITemplateControl
            * to add nodes to its body in the event that it replaces its element.
            *
            * @example this.startNode.parentNode.insertBefore(node, this.startNode.nextSibling);
            */
            public startNode: Node;
            /**
            * The last node in the ITemplateControl's body. This property will be a Comment node when the
            * control implements replaceWith = null, otherwise it will be null. This property allows a ITemplateControl
            * to add nodes to its body in the event that it replaces its element.
            *
            * @example this.endNode.parentNode.insertBefore(node, this.endNode);
            */
            public endNode: Node;
            /**
            * TemplateControls are the base control for any UIControl. They provide properties for the control to use
            * to manage its body HTML.
            */
            constructor();
            /**
            * Contains DOM helper methods for manipulating this control's element.
            */
            public dom: IDom;
            /**
            * Set to the root ancestor control from which this control inherits its context. This value
            * can be equal to this control.
            */
            public root: ITemplateControl;
            /**
            * This event is fired when a TemplateControl's context property is changed by an ancestor control.
            */
            public contextChanged(): void;
            /**
            * A method called for ITemplateControls to set their template. During this method a control should
            * ready its template for compilation. Whatever is in the control's element (or elementNodes if replaceWith
            * is implemented) after this method's execution will be compiled and appear on the DOM.
            */
            public setTemplate(): void;
            /**
            * Finds the identifier string associated with the given context object. The string returned
            * is the path from a control's context.
            *
            * @param context The object to locate on the control's context.
            *
            * @example
            *     // returns 'title'
            *     this.getIdentifier(this.context.title);
            */
            public getIdentifier(context: any): string;
            /**
            * Finds the absolute identifier string associated with the given context object. The string returned
            * is the path from a control's root ancestor's context.
            *
            * @param context The object to locate on the root control's context.
            */
            public getAbsoluteIdentifier(context: any): string;
            /**
            * Finds the associated resources and builds a context object containing
            * the values. Returns the object.
            *
            * @param aliases An array of aliases to search for.
            * @param resources An optional resources object to extend, if no resources object is passed in a new one will be created.
            */
            public getResources(aliases: string[], resources?: any): any;
            /**
            * Starts at a control and searches up its parent chain for a particular resource alias.
            * If the resource is found, it will be returned along with the control instance on which
            * the resource was found.
            *
            * @param alias The alias to search for.
            */
            public findResource(alias: string): {
                resource: any;
                control: ITemplateControl;
            };
            /**
            * Evaluates an expression string, using the control.context.
            *
            * @param expression The expression string to evaluate.
            * @param context An optional context with which to parse. If
            * no context is specified, the control.context will be used.
            */
            public evaluateExpression(expression: string, context?: any): any;
            /**
            * Evaluates a parsed expression, using the control.context.
            *
            * @param expression The IParsedExpression to evaluate.
            * @param context An optional context with which to parse. If
            * no context is specified, the control.context will be used.
            */
            public evaluateExpression(expression: expressions.IParsedExpression, context?: any): any;
            /**
            * Allows a control to observe any property on its context and receive updates when
            * the property is changed.
            *
            * @param context The immediate parent object containing the property.
            * @param property The property identifier to watch for changes.
            * @param listener The method called when the property is changed. This method will have its 'this'
            * context set to the control instance.
            */
            public observe<T>(context: any, property: string, listener: (value: T, oldValue: any) => void): IRemoveListener;
            /**
            * Allows a control to observe any property on its context and receive updates when
            * the property is changed.
            *
            * @param context The immediate parent array containing the property.
            * @param property The index to watch for changes.
            * @param listener The method called when the property is changed. This method will have its 'this'
            * context set to the control instance.
            */
            public observe<T>(context: any, property: number, listener: (value: T, oldValue: T) => void): IRemoveListener;
            /**
            * Allows a control to observe an array and receive updates when certain array-changing methods are called.
            * The methods watched are push, pop, shift, sort, splice, reverse, and unshift. This method does not watch
            * every item in the array.
            *
            * @param context The immediate parent object containing the array as a property.
            * @param property The array property identifier to watch for changes.
            * @param listener The method called when an array-changing method is called. This method will have its 'this'
            * context set to the control instance.
            */
            public observeArray<T>(context: any, property: string, listener: (ev: observable.IArrayMethodInfo<T>) => void): IRemoveListener;
            /**
            * Allows a control to observe an array and receive updates when certain array-changing methods are called.
            * The methods watched are push, pop, shift, sort, splice, reverse, and unshift. This method does not watch
            * every item in the array.
            *
            * @param context The immediate parent array containing the array as a property.
            * @param property The index on the parent array, specifying the array to watch for changes.
            * @param listener The method called when an array-changing method is called. This method will have its 'this'
            * context set to the control instance.
            */
            public observeArray<T>(context: T[], property: number, listener: (ev: observable.IArrayMethodInfo<T>) => void): IRemoveListener;
        }
        /**
        * The Type for referencing the '$TemplateControlStatic' injectable as a dependency.
        */
        function TemplateControlStatic(): typeof TemplateControl;
        /**
        * The external interface for the '$TemplateControlStatic' injectable.
        */
        interface ITemplateControlStatic {
            /**
            * Evaluates an expression string with a given control and optional context.
            *
            * @param expression The expression string (e.g. 'foo + foo').
            * @param control The control used for evaluation context.
            * @param aliases An optional alias object containing resource alias values
            */
            evaluateExpression(expression: string, control?: ITemplateControl, aliases?: any): any;
            /**
            * Evaluates a parsed expression with a given control and optional context.
            *
            * @param expression An IParsedExpression created using the '$parser' injectable.
            * @param control The control used for evaluation context.
            * @param aliases An optional alias object containing resource alias values
            */
            evaluateExpression(expression: expressions.IParsedExpression, control?: ITemplateControl, aliases?: any): any;
            /**
            * Given a control and Array of aliases, finds the associated resources and builds a context object containing
            * the values. Returns the object.
            *
            * @param control The control used as the starting point for finding resources.
            * @param aliases An array of aliases to search for.
            * @param resources An optional resources object to extend, if no resources object is passed in a new one will be created.
            */
            getResources(control: ITemplateControl, aliases: string[], resources?: any): any;
            /**
            * Starts at a control and searches up its parent chain for a particular resource alias.
            * If the resource is found, it will be returned along with the control instance on which
            * the resource was found.
            *
            * @param control The control on which to start searching for the resource alias.
            * @param alias The alias to search for.
            */
            findResource(control: ITemplateControl, alias: string): {
                resource: IResource;
                control: ITemplateControl;
            };
            /**
            * Recursively disposes a control and its children.
            * @param control A control to dispose.
            */
            dispose(control: ITemplateControl): void;
            /**
            * Loads the control tree depth first (visit children, then visit self).
            *
            * @param control The control serving as the root control to load.
            */
            loadControl(control: ITemplateControl): void;
            /**
            * Notifies a control that its context has been changed by
            * calling the control.contextChanged method if it exists.
            *
            * @param control The control whose context changed.
            * @param newValue The new value of the control's context.
            * @param oldValue The old value of the control's context.
            */
            contextChanged(control: IControl, newValue: any, oldValue: any): any;
            /**
            * Sets the 'context' resource value on a template control. If the control specifies
            * hasOwnContext, the 'rootContext' resource value will be set.
            *
            * @param control The control whose context resources will be set.
            */
            setContextResources(control: ITemplateControl): void;
            /**
            * Completely removes a control's element from its parentNode. If the
            * control implements replaceWith=null, All of its nodes between its
            * startNode and endNode (inclusive) will be removed.
            *
            * @param control The control whose element should be removed.
            */
            removeElement(control: ITemplateControl): void;
            /**
            * Sets the absoluteContextPath read-only property on a control.
            *
            * @param control The control on which to set the absoluteContextPath.
            * @param path The path to set on the control.
            */
            setAbsoluteContextPath(control: ITemplateControl, path: string): void;
            /**
            * Determines the template for a control by searching for a templateUrl,
            * using the provided templateUrl, or serializing the control's templateString.
            */
            determineTemplate(control: ITemplateControl, templateUrl?: string): any;
            /**
            * Detaches a TemplateControl. Disposes its children, but does not dispose the TemplateControl.
            *
            * @param control The control to be detached.
            */
            detach(control: ITemplateControl): void;
            /**
            * Create a new empty ITemplateControl
            */
            new(): ITemplateControl;
        }
        /**
        * Describes a control which provides properties and methods for managing its body HTML.
        */
        interface ITemplateControl extends IControl {
            /**
            * The context of an ITemplateControl, used for inheritance and data-binding.
            */
            context?: any;
            /**
            * Resources are used for providing aliases to use in markup expressions. They
            * are particularly useful when trying to access properties outside of the
            * current context, as well as reassigning context at any point in an app.
            *
            * By default, every control has a resource for '@control' and '@context'.
            * IViewControl objects also have a resource for '@root' and '@rootContext', which is a reference
            * to their root control and root context.
            *
            * Resources can be created in HTML, or through the exposed control.resources
            * object. If specified in HTML, they must be the first element child of the
            * control upon which the resources will be placed. IViewControls that use a
            * templateUrl can have resources as their first element in the templateUrl.
            *
            * @example
            * <custom-control>
            *     <plat-resources>
            *         <injectable alias="Cache">$CacheStatic</injectable>
            *         <observable alias="testObj">
            *              {
            *                  foo: 'foo',
            *                  bar: 'bar',
            *                  baz: 2
            *              }
            *         </observable>
            *     </plat-resources>
            * </custom-control>
            *
            * In the above example, the resources can be accessed by using '@Cache' and '@testObj'.
            * The type of resource is denoted by the element name.
            *
            * Only resources of type 'observable' will have data binding. The types of resources are:
            * function, injectable, observable, and object. Resources of type 'function' will have their
            * associated function context bound to the control that contains the resource.
            *
            * When an alias is found in a markup expression, the framework will search up the control chain
            * to find the alias on a control's resources. This first matching alias will be used.
            */
            resources?: IResources;
            /**
            * Flag indicating whether or not the ITemplateControl defines the context property.
            */
            hasOwnContext?: boolean;
            /**
            * Specifies the absolute path from where the context was created to this IControl's context.
            * Used by the ContextManager for maintaining context parity.
            *
            * @example 'context.childContextProperty.grandChildContextProperty'
            */
            absoluteContextPath?: string;
            /**
            * A string representing the DOM template for this control. If this property is
            * defined on a ITemplateControl then DOM will be created and put in the
            * control's element prior to calling the 'setTemplate' method.
            */
            templateString?: string;
            /**
            * A url containing a string representing the DOM template for this control. If this property is
            * defined on a ITemplateControl then DOM will be created and put in the
            * control's element prior to calling the 'setTemplate' method. This property takes
            * precedence over templateString. In the event that both are defined, templateString
            * will be ignored.
            */
            templateUrl?: string;
            /**
            * A DocumentFragment representing the innerHTML that existed when this control was instantiated.
            * This property will only contain the innerHTML when either a templateString or templateUrl is
            * defined. Its important to clone this property when injecting it somewhere, else its childNodes
            * will disappear.
            *
            * @example this.innerTemplate.cloneNode(true); //Useful if this is not a one-time injection.
            */
            innerTemplate?: DocumentFragment;
            /**
            * A IBindableTemplates object used for binding a data context to a template. This is an
            * advanced function of a ITemplateControl.
            *
            * @see IBindableTemplates
            */
            bindableTemplates?: IBindableTemplates;
            /**
            * An array of child controls. Any controls created by this control can be found in this array. The controls in
            * this array will have reference to this control in their parent property.
            */
            controls?: IControl[];
            /**
            * A Node array for managing the ITemplateControl's childNodes in the event that this control
            * replaces its element. This property will only be useful for a ITemplateControl that implements
            * replaceWith.
            */
            elementNodes?: Node[];
            /**
            * The first node in the ITemplateControl's body. This property will be a Comment node when the
            * control implements replaceWith = null, otherwise it will be null. This property allows a ITemplateControl
            * to add nodes to its body in the event that it replaces its element.
            *
            * @example this.startNode.parentNode.insertBefore(node, this.startNode.nextSibling);
            */
            startNode?: Node;
            /**
            * The last node in the ITemplateControl's body. This property will be a Comment node when the
            * control implements replaceWith, otherwise it will be null. This property allows a ITemplateControl
            * to add nodes to its body in the event that it replaces its element.
            *
            * @example this.endNode.parentNode.insertBefore(node, this.endNode);
            */
            endNode?: Node;
            /**
            * Allows a ITemplateControl to either swap its element with another element (e.g. plat-select), or
            * replace its element altogether. If null or empty string, the element will be removed from the DOM, and the
            * childNodes of the element will be in its place. In addition, when the element is placed an endNode Comment
            * is created, and the childNodes are added to the elementNodes property on the control. The replaceWith
            * property can be any property that works with document.createElement(). If the control's element had
            * attributes (as well as attribute IControls), those attributes will be carried to the swapped element.
            */
            replaceWith?: string;
            /**
            * Contains DOM helper methods for manipulating this control's element.
            */
            dom: IDom;
            /**
            * Set to the root ancestor control from which this control inherits its context. This value
            * can be equal to this control.
            */
            root: ITemplateControl;
            /**
            * A method called for ITemplateControls to set their template. During this method a control should
            * ready its template for compilation. Whatever is in the control's element (or elementNodes if replaceWith
            * is implemented) after this method's execution will be compiled and appear on the DOM.
            */
            setTemplate? (): void;
            /**
            * This event is fired when an ITemplateControl's context property is changed by an ancestor control.
            */
            contextChanged? (newValue: any, oldValue: any): void;
            /**
            * Finds the identifier string associated with the given context object. The string returned
            * is the path from a control's context.
            *
            * @param context The object to locate on the control's context.
            *
            * @example
            *     // returns 'title'
            *     this.getIdentifier(this.context.title);
            */
            getIdentifier? (context: any): string;
            /**
            * Finds the absolute identifier string associated with the given context object. The string returned
            * is the path from a control's root ancestor's context.
            *
            * @param context The object to locate on the root control's context.
            */
            getAbsoluteIdentifier? (context: any): string;
            /**
            * Finds the associated resources and builds a context object containing
            * the values. Returns the object.
            *
            * @param aliases An array of aliases to search for.
            * @param resources An optional resources object to extend, if no resources object is passed in a new one will be created.
            */
            getResources(aliases: string[], resources?: any): any;
            /**
            * Starts at a control and searches up its parent chain for a particular resource alias.
            * If the resource is found, it will be returned along with the control instance on which
            * the resource was found.
            *
            * @param alias The alias to search for.
            */
            findResource(alias: string): {
                resource: IResource;
                control: ITemplateControl;
            };
            /**
            * Evaluates an expression string, using the control.context.
            *
            * @param expression The expression string to evaluate.
            * @param context An optional context with which to parse. If
            * no context is specified, the control.context will be used.
            */
            evaluateExpression(expression: string, context?: any): any;
            /**
            * Evaluates a parsed expression, using the control.context.
            *
            * @param expression The IParsedExpression to evaluate.
            * @param context An optional context with which to parse. If
            * no context is specified, the control.context will be used.
            */
            evaluateExpression(expression: expressions.IParsedExpression, context?: any): any;
            /**
            * Allows an IControl to observe any property on its context and receive updates when
            * the property is changed.
            *
            * @param context The immediate parent object containing the property.
            * @param property The property identifier to watch for changes.
            * @param listener The method called when the property is changed. This method will have its 'this'
            * context set to the control instance.
            */
            observe? <T>(context: any, property: string, listener: (value: T, oldValue: T) => void): IRemoveListener;
            /**
            * Allows an IControl to observe any property on its context and receive updates when
            * the property is changed.
            *
            * @param context The immediate parent array containing the property.
            * @param property The index to watch for changes.
            * @param listener The method called when the property is changed. This method will have its 'this'
            * context set to the control instance.
            */
            observe? <T>(context: any, property: number, listener: (value: T, oldValue: T) => void): IRemoveListener;
            /**
            * Allows an IControl to observe an array and receive updates when certain array-changing methods are called.
            * The methods watched are push, pop, shift, sort, splice, reverse, and unshift. This method does not watch
            * every item in the array.
            *
            * @param context The immediate parent object containing the array as a property.
            * @param property The array property identifier to watch for changes.
            * @param listener The method called when an array-changing method is called. This method will have its 'this'
            * context set to the control instance.
            */
            observeArray? <T>(context: any, property: string, listener: (ev: observable.IArrayMethodInfo<T>) => void): IRemoveListener;
            /**
            * Allows an IControl to observe an array and receive updates when certain array-changing methods are called.
            * The methods watched are push, pop, shift, sort, splice, reverse, and unshift. This method does not watch
            * every item in the array.
            *
            * @param context The immediate parent array containing the array as a property.
            * @param property The index on the parent array, specifying the array to watch for changes.
            * @param listener The method called when an array-changing method is called. This method will have its 'this'
            * context set to the control instance.
            */
            observeArray? <T>(context: T[], property: number, listener: (ev: observable.IArrayMethodInfo<T>) => void): IRemoveListener;
        }
        /**
        * A control used in a controls.Viewport for simulated page navigation. The
        * control has navigation events that are called when navigating to and from the control.
        */
        class ViewControl extends TemplateControl implements IViewControl {
            /**
            * Detaches a ViewControl. Disposes its children, but does not dispose the ViewControl.
            * Useful for the Navigator when storing the ViewControl in history.
            *
            * @static
            * @param control The control to be detached.
            */
            static detach(control: IViewControl): void;
            /**
            * Recursively disposes a control and its children.
            *
            * @static
            * @param control A control to dispose.
            */
            static dispose(control: IViewControl): void;
            /**
            * Indicates whether or not this control defines its own context.
            */
            public hasOwnContext: boolean;
            /**
            * Specifies the navigator for this control. Used for navigating to other IViewControls
            * in a controls.Viewport.
            */
            public navigator: navigation.IBaseNavigator;
            /**
            * This event is fired when this control has been navigated to.
            *
            * @param parameter A navigation parameter sent from the previous IViewControl.
            */
            public navigatedTo(parameter?: any): void;
            /**
            * This event is fired when this control is being navigated away from.
            */
            public navigatingFrom(): void;
            /**
            * A ViewControl is used in a controls.Viewport for simulated page navigation. The
            * ViewControl has navigation events that are called when navigating to and from the control.
            */
            constructor();
        }
        /**
        * The Type for referencing the '$ViewControlStatic' injectable as a dependency.
        */
        function ViewControlStatic(): typeof ViewControl;
        /**
        * The external interface for the '$ViewControlStatic' injectable.
        */
        interface IViewControlStatic {
            /**
            * Detaches a ViewControl. Disposes its children, but does not dispose the ViewControl.
            * Useful for the Navigator when storing the ViewControl in history.
            *
            * @static
            * @param control The control to be detached.
            */
            detach(control: IViewControl): void;
            /**
            * Recursively disposes a control and its children.
            *
            * @static
            * @param control A control to dispose.
            */
            dispose(control: IViewControl): void;
            /**
            * Create a new empty IViewControl
            */
            new(): IViewControl;
        }
        /**
        * Describes a control used in a controls.Viewport for simulated page navigation. The
        * control has navigation events that are called when navigating to and from the control.
        */
        interface IViewControl extends ITemplateControl {
            /**
            * Specifies that this control will have its own context, and it should not inherit a context.
            */
            hasOwnContext: boolean;
            /**
            * Specifies the navigator for this control. Used for navigating to other IViewControls
            * in a controls.Viewport.
            */
            navigator: navigation.IBaseNavigator;
            /**
            * This event is fired when this control has been navigated to.
            *
            * @param parameter A navigation parameter sent from the previous IViewControl.
            */
            navigatedTo? (parameter?: any): void;
            /**
            * This event is fired when this control is being navigated away from.
            */
            navigatingFrom? (): void;
        }
        /**
        * An extensible class dealing with the creation, deletion, and modification
        * of DOM.
        */
        class Dom implements IDom {
            /**
            * Takes a Node Array and either adds it to the passed in Node,
            * or creates a DocumentFragment and adds the NodeList to the
            * Fragment.
            *
            * @param nodeList A Node Array to be appended to the root/DocumentFragment
            * @param root An optional Node to append the nodeList.
            *
            * @return {Node} The root Node or a DocumentFragment.
            */
            public appendChildren(nodeList: Node[], root?: Node): Node;
            /**
            * Takes a NodeList and either adds it to the passed in Node,
            * or creates a DocumentFragment and adds the NodeList to the
            * Fragment.
            *
            * @param nodeList A NodeList to be appended to the root/DocumentFragment
            * @param root An optional Node to append the nodeList.
            *
            * @return {Node} The root Node or a DocumentFragment.
            */
            public appendChildren(nodeList: NodeList, root?: Node): Node;
            /**
            * Clears a DOM Node by removing all of its childNodes.
            *
            * @param node The DOM Node to clear.
            */
            public clearNode(node: Node): void;
            /**
            * Removes all the Nodes in the Array from the parent Node.
            *
            * @param nodeList The Node Array to remove from the parent Node.
            * @param parent The parent Node used to remove the nodeList.
            */
            public clearNodeBlock(nodeList: Node[], parent: Node): void;
            /**
            * Removes all the Nodes in the NodeList from the parent Node.
            *
            * @param nodeList The NodeList to remove from the parent Node.
            * @param parent The parent Node used to remove the nodeList.
            */
            public clearNodeBlock(nodeList: NodeList, parent: Node): void;
            /**
            * Converts HTML string to a Node. Can be used to create text nodes.
            * Handles cross-browser issues revolving around creating elements
            * without the correct parent (e.g. '<option>Text</option>').
            *
            * @param html The html string to convert to a node.
            */
            public stringToNode(html: string): Node;
            /**
            * Sets the innerHTML of a Node. Can take in a Node rather than an HTMLElement
            * because it does not use innerHTML on the passed-in Node (it appends its
            * childNodes).
            *
            * @param node The Node to set innerHTML.
            * @param html HTML string to be put inside the node.
            *
            * @return {Node} The same node passed in, with innerHTML set.
            */
            public setInnerHtml(node: Node, html: string): Node;
            /**
            * Inserts a list of Nodes before the designated end Node.
            *
            * @param parent The parent node into which to insert nodes.
            * @param nodes The Node Array to insert into the parent.
            * @param endNode An optional endNode to use to insert nodes.
            *
            * @return {Array<Node>} An Array copy of nodes.
            */
            public insertBefore(parent: Node, nodes: Node[], endNode?: Node): Node[];
            /**
            * Inserts a list of Nodes before the designated end Node.
            *
            * @param parent The parent node into which to insert nodes.
            * @param nodes The NodeList to insert into the parent.
            * @param endNode An optional endNode to use to insert nodes.
            *
            * @return {Array<Node>} An Array copy of nodes.
            */
            public insertBefore(parent: Node, nodes: NodeList, endNode?: Node): Node[];
            /**
            * Inserts a list of Nodes before the designated end Node.
            *
            * @param parent The parent node into which to insert nodes.
            * @param fragment The DocumentFragment to insert into the parent.
            * @param endNode An optional endNode to use to insert the fragment.
            *
            * @return {Array<Node>} An Array copy of the fragment's childNodes.
            */
            public insertBefore(parent: any, fragment: DocumentFragment, endNode?: Node): Node[];
            /**
            * Takes the child nodes of the given node and places them above the node
            * in the DOM. Then removes the given node.
            *
            * @param node The Node to replace.
            *
            * @return {Array<Node>} A Node Array that represents the childNodes of the
            * given node.
            */
            public replace(node: Node): Node[];
            /**
            * Takes the childNodes of the given element and appends them to the newElement.
            * Then replaces the element in its parent's tree with the newElement.
            *
            * @param element The HTMLElement to remove from its parent.
            * @param newElement The HTMLElement populate with childNodes and add to the
            * elemnent's parent.
            *
            * @return {HTMLElement} The replaced element (newElement).
            */
            public replaceWith(element: HTMLElement, newElement: HTMLElement): HTMLElement;
            /**
            * Takes the childNodes of the given Node and appends them to the newNode.
            * Then replaces the Node in its parent's tree with the newNode.
            *
            * @param node The Node to remove from its parent.
            * @param newElement The Node populate with childNodes and add to the
            * node's parent.
            *
            * @return {Node} The replaced Node (newNode).
            */
            public replaceWith(node: Node, newNode: Node): Node;
            /**
            * Takes in a string representing innerHTML and returns a DocumentFragment
            * containing the serialized DOM.
            *
            * @param template The DOM string.
            *
            * @return {DocumentFragment} The serialized DOM.
            */
            public serializeTemplate(template: string): DocumentFragment;
            /**
            * Takes in a startNode and endNode, each having the same parentNode.
            * Removes every node in between the startNode.  If endNode is not specified,
            * DOM will be removed until the end of the parentNode's children.
            *
            * @param startNode The starting node, which will not be removed.
            * @param endNode The ending node, which will not be removed.
            */
            public removeBetween(startNode: Node, endNode?: Node): void;
            /**
            * Takes in a startNode and endNode, each having the same parentNode.
            * Removes every node in between the startNode and endNode as well as
            * the startNode and the endNode.  If endNode is not specified, DOM
            * will be removed until the end of the parentNode's children.
            *
            * @param startNode The first node to remove.
            * @param endNode The last node to remove.
            */
            public removeAll(startNode: Node, endNode?: Node): void;
        }
        /**
        * An object that deals with the creation, deletion, and modification
        * of DOM.
        */
        interface IDom {
            /**
            * Takes a Node Array and either adds it to the passed in Node,
            * or creates a DocumentFragment and adds the NodeList to the
            * Fragment.
            *
            * @param nodeList A Node Array to be appended to the root/DocumentFragment
            * @param root An optional Node to append the nodeList.
            *
            * @return {Node} The root Node or a DocumentFragment.
            */
            appendChildren(nodeList: Node[], root?: Node): Node;
            /**
            * Takes a NodeList and either adds it to the passed in Node,
            * or creates a DocumentFragment and adds the NodeList to the
            * Fragment.
            *
            * @param nodeList A NodeList to be appended to the root/DocumentFragment
            * @param root An optional Node to append the nodeList.
            *
            * @return {Node} The root Node or a DocumentFragment.
            */
            appendChildren(nodeList: NodeList, root?: Node): Node;
            /**
            * Clears a DOM Node by removing all of its childNodes.
            *
            * @param node The DOM Node to clear.
            */
            clearNode(node: Node): void;
            /**
            * Removes all the Nodes in the Array from the parent Node.
            *
            * @param nodeList The Node Array to remove from the parent Node.
            * @param parent The parent Node used to remove the nodeList.
            */
            clearNodeBlock(nodeList: Node[], parent: Node): void;
            /**
            * Removes all the Nodes in the NodeList from the parent Node.
            *
            * @param nodeList The NodeList to remove from the parent Node.
            * @param parent The parent Node used to remove the nodeList.
            */
            clearNodeBlock(nodeList: NodeList, parent: Node): void;
            /**
            * Converts HTML string to a Node. Can be used to create text nodes.
            * Handles cross-browser issues revolving around creating elements
            * without the correct parent (e.g. '<option>Text</option>').
            *
            * @param html The html string to convert to a node.
            */
            stringToNode(html: string): Node;
            /**
            * Sets the innerHTML of a Node. Can take in a Node rather than an HTMLElement
            * because it does not use innerHTML on the passed-in Node (it appends its
            * childNodes).
            *
            * @param node The Node to set innerHTML.
            * @param html HTML string to be put inside the node.
            *
            * @return {Node} The same node passed in, with innerHTML set.
            */
            setInnerHtml(node: Node, html: string): Node;
            /**
            * Inserts a list of Nodes before the designated end Node.
            *
            * @param parent The parent node into which to insert nodes.
            * @param nodes The Node Array to insert into the parent.
            * @param endNode An optional endNode to use to insert nodes.
            *
            * @return {Array<Node>} An Array copy of nodes.
            */
            insertBefore(parent: Node, nodes: Node[], endNode?: Node): Node[];
            /**
            * Inserts a list of Nodes before the designated end Node.
            *
            * @param parent The parent node into which to insert nodes.
            * @param nodes The NodeList to insert into the parent.
            * @param endNode An optional endNode to use to insert nodes.
            *
            * @return {Array<Node>} An Array copy of nodes.
            */
            insertBefore(parent: Node, nodes: NodeList, endNode?: Node): Node[];
            /**
            * Inserts a list of Nodes before the designated end Node.
            *
            * @param parent The parent node into which to insert nodes.
            * @param fragment The DocumentFragment to insert into the parent.
            * @param endNode An optional endNode to use to insert the fragment.
            *
            * @return {Array<Node>} An Array copy of the fragment's childNodes.
            */
            insertBefore(parent: any, fragment: DocumentFragment, endNode?: Node): Node[];
            /**
            * Takes the child nodes of the given node and places them above the node
            * in the DOM. Then removes the given node.
            *
            * @param node The Node to replace.
            *
            * @return {Array<Node>} A Node Array that represents the childNodes of the
            * given node.
            */
            replace(node: Node): Node[];
            /**
            * Takes the childNodes of the given element and appends them to the newElement.
            * Then replaces the element in its parent's tree with the newElement.
            *
            * @param element The HTMLElement to remove from its parent.
            * @param newElement The HTMLElement populate with childNodes and add to the
            * elemnent's parent.
            *
            * @return {HTMLElement} The replaced element (newElement).
            */
            replaceWith(element: HTMLElement, newElement: HTMLElement): HTMLElement;
            /**
            * Takes the childNodes of the given Node and appends them to the newNode.
            * Then replaces the Node in its parent's tree with the newNode.
            *
            * @param node The Node to remove from its parent.
            * @param newElement The Node populate with childNodes and add to the
            * node's parent.
            *
            * @return {Node} The replaced Node (newNode).
            */
            replaceWith(node: Node, newNode: Node): Node;
            /**
            * Takes in a string representing innerHTML and returns a DocumentFragment
            * containing the serialized DOM.
            *
            * @param template The DOM string.
            *
            * @return {DocumentFragment} The serialized DOM.
            */
            serializeTemplate(template?: string): DocumentFragment;
            /**
            * Takes in a startNode and endNode, each having the same parentNode.
            * Removes every node in between the startNode.  If endNode is not specified,
            * DOM will be removed until the end of the parentNode's children.
            *
            * @param startNode The starting node, which will not be removed.
            * @param endNode The ending node, which will not be removed.
            */
            removeBetween(startNode: Node, endNode?: Node): void;
            /**
            * Takes in a startNode and endNode, each having the same parentNode.
            * Removes every node in between the startNode and endNode as well as
            * the startNode and the endNode.  If endNode is not specified, DOM
            * will be removed until the end of the parentNode's children.
            *
            * @param startNode The first node to remove.
            * @param endNode The last node to remove.
            */
            removeAll(startNode: Node, endNode?: Node): void;
        }
        /**
        * The class which provides a way for ITemplateControls to bind a template
        * to a context. Useful for narrowing context without needing another
        * ITemplateControl. In addition, this object provides a performance increase because
        * it will only compile the template once. This object is also useful when a
        * ITemplateControl expects multiple configuration templates in its innerHTML. It can
        * separate those templates and reuse them accordingly.
        */
        class BindableTemplates implements IBindableTemplates {
            static $TemplateControlStatic: ITemplateControlStatic;
            /**
            * Creates a new instance of BindableTemplates and returns it. If a BindableTemplates is
            * passed in, it will use the properties on the original BindableTemplates.
            *
            * @static
            * @param control The ITemplateControl containing the new BindableTemplate object, used for data context
            * inheritance for templates.
            * @param originalBindableTemplates An optional IBindableTemplates object to copy.
            * @return {BindableTemplates} The newly instantiated BindableTemplates object.
            */
            static create(control: ITemplateControl, original?: IBindableTemplates): IBindableTemplates;
            /**
            * Clears the memory being held by control's bindableTemplates.
            *
            * @static
            * @param control The control whose bindableTemplates will be disposed.
            */
            static dispose(control: ITemplateControl): void;
            /**
            * The control using this BindableTemplates instance.
            */
            public control: ITemplateControl;
            /**
            * Stores the compiled templates for this object, ready to be bound to a data context.
            * All created templates are DocumentFragments, allowing a ITemplateControl to
            * easily insert the template into the DOM (without iterating over childNodes).
            */
            public templates: {};
            /**
            * A keyed cache of IElementManagers that represent the roots of compiled templates
            * created by this instance of BindableTemplates.
            */
            public _cache: IObject<processing.IElementManager>;
            public $ResourcesStatic: IResourcesStatic;
            public $PromiseStatic: async.IPromiseStatic;
            public $ManagerCacheStatic: storage.ICache<processing.IElementManager>;
            public $dom: IDom;
            public $ExceptionStatic: IExceptionStatic;
            public $document: Document;
            public $ElementManagerStatic: processing.IElementManagerStatic;
            private __compiledControls;
            /**
            * Provides a way for ITemplateControls to bind a template to a data context. Useful
            * for narrowing data context without needing another ITemplateControl. In addition,
            * this object provides a performance increase because it will only compile the template once.
            * This object is also useful when a ITemplateControl expects multiple configuration
            * templates in its innerHTML. It can separate those templates and reuse them accordingly.
            */
            constructor();
            /**
            * Method for linking a new template to a data context and returning a clone of the template,
            * with all new IControls created if the template contains controls. It is not necessary
            * to specify a data context.
            *
            * @param key The key used to retrieve the template.
            * @param callback The callback associated with binding the template to the specified data
            * context.
            * @param relativeIdentifier The identifier string relative to this control's context
            * (e.g. 'foo.bar.baz' would signify the object this.context.foo.bar.baz). This is the
            * most efficient way of specifying context, else the framework has to search for the
            * object.
            * @param resources An object used as the resources for any top-level
            * controls created in the template.
            * @return {DocumentFragment} A clone of the template, fully reconstructed and ready to put
            * in the DOM.
            */
            public bind(key: string, callback: IBindableTemplateCallback, relativeIdentifier?: string, resources?: IObject<IResource>): any;
            /**
            * Method for linking a new template to a data context and returning a clone of the template,
            * with all new IControls created if the template contains controls. It is not necessary
            * to specify a data context.
            *
            * @param key The key used to retrieve the template.
            * @param callback The callback associated with binding the template to the specified data
            * context.
            * @param context An object on this control's context. The framework will find the
            * correct path to the object. It is recommended to use the relativeIdentifier if possible,
            * as it is a more efficient method.
            * @param resources An object used as the resources for any top-level
            * controls created in the template.
            * @return {DocumentFragment} A clone of the template, fully reconstructed and ready to put
            * in the DOM.
            */
            public bind(key: string, callback: IBindableTemplateCallback, context?: any, resources?: IObject<IResource>): any;
            /**
            * Adds a template to this object. The template will be stored with the key,
            * and it will be transformed into a DocumentFragment.
            *
            * @param key The key used to store the template.
            * @param template An HTMLElement represending the template DOM.
            */
            public add(key: string, template: HTMLElement): any;
            /**
            * Adds a template to this object. The template will be stored with the key,
            * and it will be transformed into a DocumentFragment.
            *
            * @param key The key used to store the template.
            * @param template A Node array represending the template DOM.
            */
            public add(key: string, template: Node[]): any;
            /**
            * Adds a template to this object. The template will be stored with the key,
            * and it will be transformed into a DocumentFragment.
            *
            * @param key The key used to store the template.
            * @param template A NodeList represending the template DOM.
            */
            public add(key: string, template: NodeList): any;
            /**
            * Adds a template to this object. The template will be stored with the key.
            *
            * @param key The key used to store the template.
            * @param template A DocumentFragment represending the template DOM.
            */
            public add(key: string, template: DocumentFragment): any;
            /**
            * Adds a template to this object. The template will be stored with the key,
            * and it will be transformed into a DocumentFragment.
            *
            * @param key The key used to store the template.
            * @param template A Node represending the template DOM.
            */
            public add(key: string, template: Node): any;
            /**
            * Creates the template's bound control and INodeMap and initiates
            * the binding of the INodeMap for a cloned template.
            */
            public _bindTemplate(key: string, template: DocumentFragment, context: string, resources: IObject<IResource>, callback: IBindableTemplateCallback): void;
            /**
            * Clones the compiled IElementManager using the newly created
            * INodeMap and binds and loads this control's IElementManager.
            */
            public _bindNodeMap(nodeMap: processing.INodeMap, key: string): async.IPromise<void, Error>;
            /**
            * Creates the template's compiled, bound control and INodeMap and initiates
            * the compilation of the template.
            */
            public _compile(key: string, template: DocumentFragment): void;
            /**
            * Instantiates a new IElementManager for the root of this template and resolves
            * any asynchronous url templates within the template being compiled.
            */
            public _compileNodeMap(control: ITemplateControl, nodeMap: processing.INodeMap, key: string): any;
            /**
            * Creates an INodeMap for either a template being compiled or a template being bound.
            */
            public _createNodeMap(uiControl: ITemplateControl, template: Node, childContext?: string): processing.INodeMap;
            /**
            * Creates a bound control for either a template being compiled or a template being bound.
            */
            public _createBoundControl(key: string, template: DocumentFragment, relativeIdentifier?: string, resources?: IObject<IResource>): ITemplateControl;
        }
        /**
        * The Type for referencing the '$BindableTemplatesStatic' injectable as a dependency.
        */
        function BindableTemplatesStatic($TemplateControlStatic: any): typeof BindableTemplates;
        /**
        * Describes an object which provides a way for ITemplateControls to bind a template
        * to a data context. Useful for narrowing data context without needing another
        * ITemplateControl. In addition, this object provides a performance increase because
        * it will only compile the template once. This object is also useful when a
        * ITemplateControl expects multiple configuration templates in its innerHTML. It can
        * separate those templates and reuse them accordingly.
        */
        interface IBindableTemplates {
            /**
            * The control containing the IBindableTemplate object.
            */
            control: ITemplateControl;
            /**
            * Stores the compiled templates for this object, ready to be bound to a data context.
            * All created templates are DocumentFragments, allowing a ITemplateControl to
            * easily insert the template into the DOM (without iterating over childNodes). This object
            * may contain a template promise.
            */
            templates: {};
            /**
            * Method for linking a new template to a data context and returning a clone of the template,
            * with all new IControls created if the template contains controls. It is not necessary
            * to specify a data context.
            *
            * @param key The key used to retrieve the template.
            * @param callback The callback associated with binding the template to the specified data
            * context.
            * @param relativeIdentifier The identifier string relative to this control's context
            * (e.g. 'foo.bar.baz' would signify the object this.context.foo.bar.baz). This is the
            * most efficient way of specifying context, else the framework has to search for the
            * object.
            * @param resources An object used as the resources for any top-level
            * controls created in the template.
            * @return {DocumentFragment} A clone of the template, fully reconstructed and ready to put
            * in the DOM.
            */
            bind(key: string, callback: IBindableTemplateCallback, relativeIdentifier?: string, resources?: IObject<IResource>): any;
            /**
            * Method for linking a new template to a data context and returning a clone of the template,
            * with all new IControls created if the template contains controls. It is not necessary
            * to specify a data context.
            *
            * @param key The key used to retrieve the template.
            * @param callback The callback associated with binding the template to the specified data
            * context.
            * @param context An object on this control's context. The framework will find the
            * correct path to the object. It is recommended to use the relativeIdentifier if possible,
            * as it is a more efficient method.
            * @param resources An object used as the resources for any top-level
            * controls created in the template.
            * @return {DocumentFragment} A clone of the template, fully reconstructed and ready to put
            * in the DOM.
            */
            bind(key: string, callback: IBindableTemplateCallback, context?: any, resources?: IObject<IResource>): any;
            /**
            * Adds a template to this object. The template will be stored with the key,
            * and it will be transformed into a DocumentFragment.
            *
            * @param key The key used to store the template.
            * @param template An HTMLElement represending the template DOM.
            */
            add(key: string, template: HTMLElement): any;
            /**
            * Adds a template to this object. The template will be stored with the key,
            * and it will be transformed into a DocumentFragment.
            *
            * @param key The key used to store the template.
            * @param template A Node array represending the template DOM.
            */
            add(key: string, template: Node[]): any;
            /**
            * Adds a template to this object. The template will be stored with the key,
            * and it will be transformed into a DocumentFragment.
            *
            * @param key The key used to store the template.
            * @param template A NodeList represending the template DOM.
            */
            add(key: string, template: NodeList): any;
            /**
            * Adds a template to this object. The template will be stored with the key.
            *
            * @param key The key used to store the template.
            * @param template A DocumentFragment represending the template DOM.
            */
            add(key: string, template: DocumentFragment): any;
            /**
            * Adds a template to this object. The template will be stored with the key,
            * and it will be transformed into a DocumentFragment.
            *
            * @param key The key used to store the template.
            * @param template A Node represending the template DOM.
            */
            add(key: string, template: Node): any;
        }
        /**
        * Describes a function used as the callback associated with binding a specified
        * template to a specified data context.
        *
        * @param clone The bound clone of the specified template.
        */
        interface IBindableTemplateCallback {
            /**
            * Receives a DocumentFragment clone ready to inject into DOM.
            *
            * @param clone The bound clone of the specified template.
            */
            (clone: DocumentFragment): void;
        }
        /**
        * The external interface for the '$BindableTemplatesStatic' injectable.
        */
        interface IBindableTemplatesStatic {
            /**
            * Creates a new instance of BindableTemplates and returns it. If a BindableTemplates is
            * passed in, it will use the properties on the original BindableTemplates.
            *
            * @static
            * @param control The ITemplateControl containing the new BindableTemplate object, used for data context
            * inheritance for templates.
            * @param originalBindableTemplates An optional IBindableTemplates object to copy.
            * @return {BindableTemplates} The newly instantiated BindableTemplates object.
            */
            create(control: ITemplateControl, original?: IBindableTemplates): IBindableTemplates;
            /**
            * Clears the memory being held by control's bindableTemplates.
            *
            * @static
            * @param control The control whose bindableTemplates will be disposed.
            */
            dispose(control: ITemplateControl): void;
        }
        /**
        * The class that stores the information about an HTMLElement's attribute NamedNodeMap.
        * Methods are implemented to allow you to observe for changes on an attribute.
        *
        * Attributes for this object are converted from dash-notation to camelCase notation.
        */
        class Attributes implements IAttributes {
            private __listeners;
            private __control;
            /**
            * Stores the information about an HTMLElement's attribute NamedNodeMap, and allows a control to observe
            * for changes on an attribute. The interface takes in a generic type, allowing ITemplateControls
            * to specify an interface for their plat-options.
            *
            * Attributes for this object are converted from dash-notation to camelCase notation. 'plat-options' are
            * parsed and stored as an object on this object, all other attributes are stored with their string values.
            *
            * @param control The control they'll be placed upon as a property.
            * @param attributes The attributes and their values present on the HTMLElement.
            */
            public initialize(control: IControl, attributes: IObject<string>): void;
            /**
            * Provides a way to observe an attribute for changes.
            *
            * @param key The attribute to observe for changes (e.g. 'platOptions').
            * @param listener The listener function to be called when the attribute changes. The
            * 'this' context of the listener will be scoped to the control instance.
            */
            public observe(key: string, listener: (newValue: any, oldValue: any) => void): IRemoveListener;
            /**
            * Used to show an attribute has been changed and forces listeners to be fired.
            *
            * @param key The attribute being observed for changes (e.g. 'platOptions').
            * @param newValue The new value of the attribute.
            * @param oldValue The previous value of the attribute.
            */
            public attributeChanged(key: string, newValue: any, oldValue: any): void;
        }
        /**
        * Describes an object that stores the information about an HTMLElement's attribute NamedNodeMap.
        * Methods are implemented to allow you to observe for changes on an attribute.
        *
        * Attributes for this object are converted from dash-notation to camelCase notation.
        */
        interface IAttributes {
            /**
            * Stores the information about an HTMLElement's attribute NamedNodeMap, and allows a control to observe
            * for changes on an attribute. The interface takes in a generic type, allowing ITemplateControls
            * to specify an interface for their plat-options.
            *
            * Attributes for this object are converted from dash-notation to camelCase notation. 'plat-options' are
            * parsed and stored as an object on this object, all other attributes are stored with their string values.
            */
            initialize(control: IControl, attributes: IObject<string>): void;
            /**
            * Provides a way to observe an attribute for changes.
            *
            * @param key The attribute to observe for changes.
            * @param listener The listener function to be called when the attribute changes.
            */
            observe(key: string, listener: (newValue: any, oldValue: any) => void): IRemoveListener;
        }
        /**
        * Resources are used for providing aliases to use in markup expressions. They
        * are particularly useful when trying to access properties outside of the
        * current context, as well as reassigning context at any point in an app.
        *
        * By default, every control has a resource for '@control' and '@context'.
        * IViewControl objects also have a resource for '@root' and '@rootContext',
        * which is a reference to the control and its context.
        *
        * Resources can be created in HTML, or through the exposed control.resources
        * object. If specified in HTML, they must be the first element child of the
        * control upon which the resources will be placed. IViewControls that use a
        * templateUrl can have resources as their first element in the templateUrl.
        *
        * @example
        * <custom-control>
        *     <plat-resources>
        *         <injectable alias="Cache">$CacheStatic</injectable>
        *         <observable alias="testObj">
        *              {
        *                  foo: 'foo',
        *                  bar: 'bar',
        *                  baz: 2
        *              }
        *         </observable>
        *     </plat-resources>
        * </custom-control>
        *
        * In the above example, the resources can be accessed by using '@Cache' and '@testObj'.
        * The type of resource is denoted by the element name.
        *
        * Only resources of type 'observable' will have data binding. The types of resources are:
        * function, injectable, observable, and object. Resources of type 'function' will have their
        * associated function context bound to the control that contains the resource.
        *
        * When an alias is found in a markup expression, the framework will search up the control chain
        * to find the alias on a control's resources. This first matching alias will be used.
        */
        class Resources implements IResources {
            static $ContextManagerStatic: observable.IContextManagerStatic;
            static $regex: expressions.IRegex;
            static $ExceptionStatic: IExceptionStatic;
            /**
            * Populates an IResource value if necessary, and adds it to the given
            * control's resources.
            *
            * @static
            * @param control The control for which to create a resource.
            * @param resource The IResource used to set the value.
            */
            static createResource(control: ITemplateControl, resource: IResource): IResource;
            /**
            * Adds resource aliases for '@control' and '@context'. The resources are
            * aliases for the control instance and the control.context.
            *
            * @static
            * @param control The control on which to add the resources.
            */
            static addControlResources(control: ITemplateControl): void;
            /**
            * Binds the resources in a resource instance. This involves injecting
            * the injectable resources, creating object/observable resources, and
            * binding functions to the associated control's instance.
            *
            * @static
            * @param resourcesInstance The instance of the IResources object.
            */
            static bindResources(resourcesInstance: IResources): void;
            /**
            * Disposes a resource instance, removing its reference
            * from a control and breaking references to all resource
            * objects.
            *
            * @static
            * @param control The control whose resources will be disposed.
            * @param persist Whether or not to persist a resource object post
            * disposal or set it to null.
            */
            static dispose(control: ITemplateControl, persist?: boolean): void;
            /**
            * Parses a resources HTMLElement and creates
            * an IObject<IResource> with its element children.
            *
            * @static
            * @param element The resources element to parse.
            *
            * @return {IObject<IResource>} The resources created
            * using element.
            */
            static parseElement(element: HTMLElement): IObject<IResource>;
            /**
            * Returns a new instance of IResources.
            *
            * @static
            */
            static getInstance(): Resources;
            /**
            * Observes the resource if the type is 'observable'.
            *
            * @static
            * @param control The control in charge of the observable resource.
            * @param resource The resource to observe.
            */
            static _observeResource(control: ITemplateControl, resource: IResource): void;
            /**
            * Removes observable resource listeners for a specified control.
            *
            * @static
            * @param control The control whose listeners are being removed.
            */
            static _removeListeners(control: ITemplateControl): void;
            private static __controlResources;
            private static __resourceTypes;
            private static __observableResourceRemoveListeners;
            /**
            * Adds a '@root' alias and '@rootContext' to a control, specifying that it contains the root
            * and root context. Root controls are the root IViewControl.
            *
            * @param control The root IViewControl.
            */
            private static __addRoot(control);
            private __resources;
            private __bound;
            private __controlInstance;
            /**
            * Initializes the control's Resources instance.
            *
            * @param control The control containing this Resources instance.
            * @param element An optional element used to create initial IResource objects.
            */
            public initialize(control: ITemplateControl, element?: HTMLElement): void;
            /**
            * Initializes the control's Resources instance.
            *
            * @param control The control containing this Resources instance.
            * @param resources An optional IObject<IResource> used to populate initial
            * IResource objects.
            */
            public initialize(control: ITemplateControl, resources?: IObject<IResource>): void;
            /**
            * Initializes the control's Resources instance.
            *
            * @param control The control containing this Resources instance.
            * @param element An optional IResources object used to populate initial
            * IResource objects.
            */
            public initialize(control: ITemplateControl, resources?: IResources): void;
            /**
            * Used for programatically adding IResource objects.
            *
            * @param resources An IObject<IResource> used to add
            * resources, keyed by their alias.
            *
            * @example control.resources.add({
            *     myAlias: {
            *         type: 'observable',
            *         value: {
            *             hello: 'Hello World!'
            *         }
            *     }
            * });
            */
            public add(resources: IObject<IResource>): void;
            /**
            * Used for programatically adding IResource objects.
            *
            * @param element An HTMLElement containing resource element children.
            *
            * @example
            *     <plat-resources>
            *         <injectable alias="Cache">$CacheStatic</injectable>
            *         <observable alias="testObj">{ foo: 'foo', bar: 'bar', baz: 2 }</observable>
            *     </plat-resources>
            *
            * The resource type is specified by the element name.
            */
            public add(element: HTMLElement): void;
        }
        /**
        * The Type for referencing the '$ResourcesStatic' injectable as a dependency.
        */
        function ResourcesStatic($ContextManagerStatic: any, $regex: any, $ExceptionStatic: any): typeof Resources;
        /**
        * Resources are used for providing aliases to use in markup expressions. They
        * are particularly useful when trying to access properties outside of the
        * current context, as well as reassigning context at any point in an app.
        *
        * By default, every control has a resource for '@control' and '@context'.
        * IViewControl objects also have a resource for '@root' and '@rootContext',
        * which is a reference to the control and its context.
        *
        * Resources can be created in HTML, or through the exposed control.resources
        * object. If specified in HTML, they must be the first element child of the
        * control upon which the resources will be placed. IViewControls that use a
        * templateUrl can have resources as their first element in the templateUrl.
        *
        * @example
        * <custom-control>
        *     <plat-resources>
        *         <injectable alias="Cache">$CacheStatic</injectable>
        *         <observable alias="testObj">
        *              {
        *                  foo: 'foo',
        *                  bar: 'bar',
        *                  baz: 2
        *              }
        *         </observable>
        *     </plat-resources>
        * </custom-control>
        *
        * In the above example, the resources can be accessed by using '@Cache' and '@testObj'.
        * The type of resource is denoted by the element name.
        *
        * Only resources of type 'observable' will have data binding. The types of resources are:
        * function, injectable, observable, and object. Resources of type 'function' will have their
        * associated function context bound to the control that contains the resource.
        *
        * When an alias is found in a markup expression, the framework will search up the control chain
        * to find the alias on a control's resources. This first matching alias will be used.
        */
        interface IResources {
            /**
            * Used for programatically adding IResource objects.
            *
            * @param resources An IObject<IResource> used to add
            * resources, keyed by their alias.
            *
            * @example control.resources.add({
            *     myAlias: {
            *         type: 'observable',
            *         value: {
            *             hello: 'Hello World!'
            *         }
            *     }
            * });
            */
            add(resources: IObject<IResource>): any;
            /**
            * Used for programatically adding IResource objects.
            *
            * @param element An HTMLElement containing resource element children.
            *
            * @example
            *     <plat-resources>
            *         <injectable alias="Cache">$CacheStatic</injectable>
            *         <observable alias="testObj">{ foo: 'foo', bar: 'bar', baz: 2 }</observable>
            *     </plat-resources>
            *
            * The resource type is specified by the element name.
            */
            add(element: HTMLElement): void;
            /**
            * @param control The control containing this Resources instance.
            * @param element An optional element used to create initial IResource objects.
            */
            initialize(control: ITemplateControl, element?: HTMLElement): any;
            /**
            * @param control The control containing this Resources instance.
            * @param resources An optional IObject<IResource> used to populate initial
            * IResource objects.
            */
            initialize(control: ITemplateControl, resources?: IObject<IResource>): any;
            /**
            * @param control The control containing this Resources instance.
            * @param element An optional IResources object used to populate initial
            * IResource objects.
            */
            initialize(control: ITemplateControl, resources?: IResources): any;
        }
        /**
        * Defines a single resource on the IResources object.
        */
        interface IResource {
            /**
            * The type of resource.
            * - injectable
            * - observable
            * - object
            * - function
            */
            type: string;
            /**
            * The alias used to reference the Resource.
            */
            alias?: string;
            /**
            * The value of the Resource
            */
            value?: any;
            /**
            * The initial value prior to it being observed.
            */
            initialValue?: any;
        }
        /**
        * The external interface for the '$ResourcesStatic' injectable.
        */
        interface IResourcesStatic {
            /**
            * Populates an IResource value if necessary, and adds it to the given
            * control's resources.
            *
            * @static
            * @param control The control for which to create a resource.
            * @param resource The IResource used to set the value.
            */
            createResource(control: ITemplateControl, resource: IResource): IResource;
            /**
            * Adds resource aliases for '@control' and '@context'. The resources are
            * aliases for the control instance and the control.context.
            *
            * @static
            * @param control The control on which to add the resources.
            */
            addControlResources(control: ITemplateControl): void;
            /**
            * Binds the resources in a resource instance. This involves injecting
            * the injectable resources, creating object/observable resources, and
            * binding functions to the associated control's instance.
            *
            * @static
            * @param resourcesInstance The instance of the IResources object.
            */
            bindResources(resourcesInstance: IResources): void;
            /**
            * Disposes a resource instance, removing its reference
            * from a control and breaking references to all resource
            * objects.
            *
            * @static
            * @param control The control whose resources will be disposed.
            * @param persist Whether or not to persist a resource object post
            * disposal or set it to null.
            */
            dispose(control: ITemplateControl, persist?: boolean): void;
            /**
            * Parses a resources HTMLElement and creates
            * an IObject<IResource> with its element children.
            *
            * @static
            * @param element The resources element to parse.
            *
            * @return {IObject<IResource>} The resources created
            * using element.
            */
            parseElement(element: HTMLElement): IObject<IResource>;
            /**
            * Returns a new instance of IResources
            *
            * @static
            */
            getInstance(): IResources;
        }
        module controls {
            class Baseport extends TemplateControl implements IBaseport {
                public navigator: navigation.IBaseNavigator;
                public $ManagerCacheStatic: storage.ICache<processing.IElementManager>;
                public $ExceptionStatic: IExceptionStatic;
                public $document: Document;
                public $ElementManagerStatic: processing.IElementManagerStatic;
                constructor(navigator: navigation.IBaseNavigator);
                /**
                * Clears the Baseport's innerHTML.
                */
                public setTemplate(): void;
                /**
                * Initializes the navigator.
                *
                * @param navigationParameter A parameter needed
                * to perform the specified type of navigation.
                * @param options The IBaseNavigationOptions
                * needed on load for the inherited form of
                * navigation.
                */
                public loaded(navigationParameter?: any, options?: navigation.IBaseNavigationOptions): void;
                /**
                * Grabs the root of this Baseport's manager
                * tree, clears it, and initializes the
                * creation of a new one by kicking off a
                * navigate.
                *
                * @param ev The navigation options
                */
                public navigateTo(ev: IBaseportNavigateToOptions): void;
                /**
                * Manages the navigatingFrom lifecycle event for
                * ViewControls.
                *
                * @param fromControl The ViewControl being navigated
                * away from.
                */
                public navigateFrom(fromControl: IViewControl): void;
            }
            /**
            * Navigation options for a Baseport and all
            * controls that inherit from Baseport.
            */
            interface IBaseportNavigateToOptions {
                /**
                * Either a view control or an injector for a view control.
                */
                target: any;
                /**
                * The navigation parameter.
                */
                parameter: any;
                /**
                * The options used for navigation.
                */
                options: navigation.IBaseNavigationOptions;
                /**
                * The type of view control to navigate to.
                */
                type: string;
            }
            interface IBaseport extends ITemplateControl {
                /**
                * The object in charge of performing the
                * navigation to and from different
                * ViewControls.
                */
                navigator: navigation.IBaseNavigator;
                /**
                * Grabs the root of this Baseport's manager
                * tree, clears it, and initializes the
                * creation of a new one by kicking off a
                * navigate.
                *
                * @param ev The navigation options
                */
                navigateTo(ev: IBaseportNavigateToOptions): void;
                /**
                * Manages the navigatingFrom lifecycle event for
                * ViewControls.
                *
                * @param fromControl The ViewControl being navigated
                * away from.
                */
                navigateFrom(fromControl: IViewControl): void;
            }
            class Viewport extends Baseport {
                /**
                * The evaluated plat-options object.
                */
                public options: observable.IObservableProperty<IViewportOptions>;
                /**
                * A type of navigator that uses either the ViewControl's
                * Constructors or their registered names for navigation
                * from one to another.
                */
                public navigator: navigation.INavigator;
                /**
                * Checks for a defaultView, finds the ViewControl's injector,
                * and initializes the loading of the view.
                */
                public loaded(): void;
            }
            /**
            * The available options for plat.ui.controls.Viewport.
            */
            interface IViewportOptions {
                /**
                * The registered name of the default
                * ViewControl to initially navigate to.
                */
                defaultView: string;
            }
            /**
            * The available options for plat.ui.controls.Routeport.
            */
            interface IRouteportOptions {
                /**
                * The registered route of the default
                * ViewControl to initially navigate to.
                */
                defaultRoute: string;
            }
            class Template extends TemplateControl {
                /**
                * Removes the <plat-template> node from the DOM
                */
                public replaceWith: string;
                /**
                * The evaluated plat-options object.
                */
                public options: observable.IObservableProperty<ITemplateOptions>;
                public $PromiseStatic: async.IPromiseStatic;
                public $templateCache: storage.ITemplateCache;
                public $ExceptionStatic: IExceptionStatic;
                /**
                * The unique ID used to reference a particular
                * template.
                */
                public _id: string;
                /**
                * The optional URL associated with this
                * particular template.
                */
                public _url: string;
                private __isFirst;
                private __templatePromise;
                private __templateControlCache;
                constructor();
                /**
                * Initializes the creation of the template.
                */
                public initialize(): void;
                /**
                * Decides if this is a template definition or
                * a template instance.
                */
                public loaded(): void;
                /**
                * Removes the template from the template cache.
                */
                public dispose(): void;
                /**
                * Determines whether a URL or innerHTML is being used,
                * creates the bindable template, and stores the template
                * in a template cache for later use.
                */
                public _initializeTemplate(): void;
                /**
                * Waits for the template promise to resolve, then initializes
                * the binding of the bindable template and places it into the
                * DOM.
                *
                * @param templatePromise The promise associated with the first
                * instance of the template with this ID.
                */
                public _waitForTemplateControl(templatePromise: async.IPromise<Template, async.IAjaxError>): void;
                /**
                * Binds the template to the proper context and
                * resolves the clone to be placed into the DOM.
                */
                public _instantiateTemplate(): async.IPromise<DocumentFragment, Error>;
                private __mapBindableTemplates(control);
            }
            /**
            * The available options for plat.ui.controls.Template.
            */
            interface ITemplateOptions {
                /**
                * The unique ID used to label a template
                * and use it as DOM.
                */
                id: string;
                /**
                * An optional URL to specify a template
                * instead of using the element's innerHTML.
                */
                url: string;
            }
            class Ignore extends TemplateControl {
                /**
                * Removes the innerHTML from the DOM and saves it.
                */
                public setTemplate(): void;
                /**
                * Places the saved innerHTML back into the DOM.
                */
                public loaded(): void;
            }
            class ForEach extends TemplateControl {
                /**
                * The required context is an Array.
                */
                public context: any[];
                /**
                * The ForEach element will not appear in the DOM.
                */
                public replaceWith: string;
                public controls: ITemplateControl[];
                private __clearTimeouts;
                private __removeListener;
                /**
                * Creates a bindable template with the elementNodes (innerHTML)
                * specified for the ForEach.
                */
                public setTemplate(): void;
                /**
                * Re-syncs the ForEach children controls and DOM with the new
                * array.
                *
                * @param newValue The new Array
                * @param oldValue The old Array
                */
                public contextChanged(newValue?: any[], oldValue?: any[]): void;
                /**
                * Observes the array for changes and adds initial items to the DOM.
                */
                public loaded(): void;
                /**
                * Removes the Array listener
                */
                public dispose(): void;
                /**
                * Adds an item to the ForEach's element.
                */
                public _addItem(item: DocumentFragment): void;
                /**
                * Removes an item from the ForEach's element.
                */
                public _removeItem(): void;
                /**
                * Updates the ForEach's children resource objects when
                * the array changes.
                */
                public _updateResources(): void;
                /**
                * Sets a listener for the changes to the array.
                */
                public _setListener(): void;
                /**
                * Receives an event when a method has been called on an array.
                *
                * @param ev The IArrayMethodInfo
                */
                public _arrayChanged(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Maps an array method to its associated method handler.
                *
                * @param ev The IArrayMethodInfo
                */
                public _executeEventAsync(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Adds new items to the ForEach's element when items are added to
                * the array.
                *
                * @param numberOfItems The number of items to add.
                * @param index The point in the array to start adding items.
                */
                public _addItems(numberOfItems: number, index: number): void;
                /**
                * Returns a resource alias object for an item in the array. The
                * resource object contains index:number, even:boolean, odd:boolean,
                * and first:boolean.
                *
                * @param index The index used to create the resource aliases.
                */
                public _getAliases(index: number): IObject<IResource>;
                /**
                * Removes items from the ForEach's element.
                *
                * @param numberOfItems The number of items to remove.
                */
                public _removeItems(numberOfItems: number): void;
                /**
                * Handles items being pushed into the array.
                *
                * @param ev The IArrayMethodInfo
                */
                public _push(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles items being popped off the array.
                *
                * @param ev The IArrayMethodInfo
                */
                public _pop(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles items being shifted off the array.
                *
                * @param ev The IArrayMethodInfo
                */
                public _shift(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles adding/removing items when an array is spliced.
                *
                * @param ev The IArrayMethodInfo
                */
                public _splice(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles items being unshifted into the array.
                *
                * @param ev The IArrayMethodInfo
                */
                public _unshift(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles when the array is sorted.
                *
                * @param ev The IArrayMethodInfo
                */
                public _sort(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles when the array is reversed.
                *
                * @param ev The IArrayMethodInfo
                */
                public _reverse(ev: observable.IArrayMethodInfo<any>): void;
            }
            interface IForEach {
                /**
                * Adds an item to the ForEach's element.
                */
                _addItem(item: DocumentFragment): void;
                /**
                * Removes an item from the ForEach's element.
                */
                _removeItem(): void;
                /**
                * Updates the ForEach's children resource objects when
                * the array changes.
                */
                _updateResources(): void;
                /**
                * Sets a listener for the changes to the array.
                */
                _setListener(): void;
                /**
                * Receives an event when a method has been called on an array.
                *
                * @param ev The IArrayMethodInfo
                */
                _arrayChanged(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Maps an array method to its associated method handler.
                *
                * @param ev The IArrayMethodInfo
                */
                _executeEventAsync(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Adds new items to the ForEach's element when items are added to
                * the array.
                *
                * @param numberOfItems The number of items to add.
                * @param index The point in the array to start adding items.
                */
                _addItems(numberOfItems: number, index: number): void;
                /**
                * Returns a resource alias object for an item in the array. The
                * resource object contains index:number, even:boolean, odd:boolean,
                * and first:boolean.
                *
                * @param index The index used to create the resource aliases.
                */
                _getAliases(index: number): IObject<IResource>;
                /**
                * Removes items from the ForEach's element.
                *
                * @param numberOfItems The number of items to remove.
                */
                _removeItems(numberOfItems: number): void;
                /**
                * Handles items being pushed into the array.
                *
                * @param ev The IArrayMethodInfo
                */
                _push(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles items being popped off the array.
                *
                * @param ev The IArrayMethodInfo
                */
                _pop(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles items being shifted off the array.
                *
                * @param ev The IArrayMethodInfo
                */
                _shift(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles adding/removing items when an array is spliced.
                *
                * @param ev The IArrayMethodInfo
                */
                _splice(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles items being unshifted into the array.
                *
                * @param ev The IArrayMethodInfo
                */
                _unshift(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles when the array is sorted.
                *
                * @param ev The IArrayMethodInfo
                */
                _sort(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Handles when the array is reversed.
                *
                * @param ev The IArrayMethodInfo
                */
                _reverse(ev: observable.IArrayMethodInfo<any>): void;
            }
            class Html extends TemplateControl {
                /**
                * Loads the new HTML String.
                */
                public contextChanged(): void;
                /**
                * Loads the context as the innerHTML of the element.
                */
                public loaded(): void;
            }
            class Select extends TemplateControl {
                /**
                * Replaces the <plat-select> node with
                * a <select> node.
                */
                public replaceWith: string;
                /**
                * Specifies the context as an Array.
                */
                public context: any[];
                /**
                * An object that keeps track of unique
                * optgroups.
                */
                public groups: IObject<HTMLElement>;
                /**
                * The evaluated plat-options object.
                */
                public options: observable.IObservableProperty<ISelectOptions>;
                public $PromiseStatic: async.IPromiseStatic;
                public $Exception: IExceptionStatic;
                private __removeListener;
                private __isGrouped;
                private __group;
                private __defaultOption;
                /**
                * Creates the bindable option template and grouping
                * template if necessary.
                */
                public setTemplate(): void;
                /**
                * Re-observes the new array context and modifies
                * the options accordingly.
                *
                * @param newValue The new array context.
                * @param oldValue The old array context.
                */
                public contextChanged(newValue?: any[], oldValue?: any[]): void;
                /**
                * Observes the new array context and adds
                * the options accordingly.
                */
                public loaded(): void;
                /**
                * Stops observing the array context.
                */
                public dispose(): void;
                /**
                * Adds the options to the select element.
                *
                * @param numberOfItems The number of items
                * to add.
                * @param length The current index of the next
                * set of items to add.
                */
                public _addItems(numberOfItems: number, length: number): void;
                /**
                * The callback used to add an option after
                * its template has been bound.
                *
                * @param index The current index of the item being added.
                * @param item The item being added.
                * @param optionClone The bound DocumentFragment to be
                * inserted into the DOM.
                */
                public _insertOptions(index: number, item: any, optionClone: DocumentFragment): void;
                /**
                * Removes an item from the DOM.
                *
                * @param parent The element whose child
                * will be removed.
                */
                public _removeItem(parent: HTMLElement): void;
                /**
                * Removes a specified number of elements.
                *
                * @param numberOfItems The number of items
                * to remove.
                */
                public _removeItems(numberOfItems: number): void;
                /**
                * The function called when an item has been removed
                * from the array context.
                *
                * @param ev The array mutation object
                */
                public _itemRemoved(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * Resets the select element by removing all its
                * items and adding them back.
                */
                public _resetSelect(): void;
                /**
                * The function called when an element is pushed to
                * the array context.
                *
                * @param ev The array mutation object
                */
                public _push(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * The function called when an item is popped
                * from the array context.
                *
                * @param ev The array mutation object
                */
                public _pop(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * The function called when an item is shifted
                * from the array context.
                *
                * @param ev The array mutation object
                */
                public _shift(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * The function called when items are spliced
                * from the array context.
                *
                * @param ev The array mutation object
                */
                public _splice(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * The function called when an item is unshifted
                * onto the array context.
                *
                * @param ev The array mutation object
                */
                public _unshift(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * The function called when the array context
                * is sorted.
                *
                * @param ev The array mutation object
                */
                public _sort(ev: observable.IArrayMethodInfo<any>): void;
                /**
                * The function called when the array context
                * is reversed.
                *
                * @param ev The array mutation object
                */
                public _reverse(ev: observable.IArrayMethodInfo<any>): void;
            }
            /**
            * The available options for plat.ui.controls.Select.
            */
            interface ISelectOptions {
                /**
                * The property in your context array
                * of objects to use to group the objects
                * into optgroups.
                */
                group: string;
                /**
                * The property in your context array of
                * objects with which to use to bind to the
                * option's value.
                */
                value: string;
                /**
                * The property in your context array of
                * objects with which to use to bind to the
                * option's textContent.
                */
                textContent: string;
            }
            class If extends TemplateControl implements IIf {
                /**
                * Removes the <plat-if> node from the DOM
                */
                public replaceWith: string;
                /**
                * The evaluated plat-options object.
                */
                public options: observable.IObservableProperty<IIfOptions>;
                public $ExceptionStatic: IExceptionStatic;
                private __removeListener;
                private __condition;
                /**
                * Creates a bindable template with its element nodes.
                */
                public setTemplate(): void;
                /**
                * Checks the options and initializes the
                * evaluation.
                */
                public contextChanged(): void;
                /**
                * Sets the visibility to true if no options are
                * defined, kicks off the evaluation, and observes
                * the options for changes.
                */
                public loaded(): void;
                /**
                * Stops listening to the options for changes.
                */
                public dispose(): void;
                /**
                * Checks the condition and decides
                * whether or not to add or remove
                * the node from the DOM.
                */
                public setter(options: IIfOptions): void;
                /**
                * The callback used to add the fragment to the DOM
                * after the bindableTemplate has been created.
                *
                * @param item The DocumentFragment consisting of
                * the inner template of the node.
                */
                public _addItem(item: DocumentFragment): void;
                /**
                * Removes the node from the DOM.
                */
                public _removeItem(): void;
            }
            interface IIf {
                /**
                * Checks the condition and decides
                * whether or not to add or remove
                * the node from the DOM.
                */
                setter(options: IIfOptions): void;
            }
            /**
            * The available options for plat.ui.controls.If.
            */
            interface IIfOptions {
                /**
                * A boolean expression to bind to
                * the element's visibility.
                */
                condition: boolean;
            }
        }
    }
    module processing {
        /**
        * Responsible for iterating through the DOM and collecting controls.
        */
        class Compiler implements ICompiler {
            public $ElementManagerStatic: IElementManagerStatic;
            public $TextManageStatic: ITextManagerStatic;
            public $CommentManagerStatic: ICommentManagerStatic;
            public $ManagerCacheStatic: storage.ICache<INodeManager>;
            /**
            * Goes through the childNodes of the given Node, finding elements that contain controls as well as
            * text that contains markup.
            *
            * @param node The node whose childNodes are going to be compiled.
            * @param control The parent control for the given Node. The parent must implement ui.ITemplateControl
            * since only controls that implement ui.ITemplateControl can contain templates.
            */
            public compile(node: Node, control?: ui.ITemplateControl): any;
            /**
            * Goes through the Node array, finding elements that contain controls as well as
            * text that contains markup.
            *
            * @param nodes The Node array to be compiled.
            * @param control The parent control for the given Node array. The parent must implement ui.ITemplateControl
            * since only controls that implement ui.ITemplateControl are responsible for creating DOM.
            */
            public compile(nodes: Node[], control?: ui.ITemplateControl): any;
            /**
            * Goes through the NodeList, finding elements that contain controls as well as
            * text that contains markup.
            *
            * @param nodes The NodeList to be compiled.
            * @param control The parent control for the given NodeList. The parent must implement ui.ITemplateControl
            * since only controls that implement ui.ITemplateControl are responsible for creating DOM.
            */
            public compile(nodes: NodeList, control?: ui.ITemplateControl): any;
            /**
            * Iterates through the array of nodes creating Element Managers on Element
            * nodes, Text Managers on text nodes, and Comment Managers on comment nodes.
            *
            * @param nodes The NodeList to be compiled.
            * @param manager The parent Element Manager for the given array of nodes.
            */
            public _compileNodes(nodes: Node[], manager: IElementManager): void;
        }
        /**
        * Describes an object that iterates through the DOM and collects controls.
        */
        interface ICompiler {
            /**
            * Goes through the childNodes of the given Node, finding elements that contain controls as well as
            * text that contains markup.
            *
            * @param node The node whose childNodes are going to be compiled.
            * @param control The parent control for the given Node. The parent must implement ui.ITemplateControl
            * since only controls that implement ui.ITemplateControl can contain templates.
            */
            compile(node: Node, control?: ui.ITemplateControl): any;
            /**
            * Goes through the Node array, finding elements that contain controls as well as
            * text that contains markup.
            *
            * @param nodes The Node array to be compiled.
            * @param control The parent control for the given Node array. The parent must implement ui.ITemplateControl
            * since only controls that implement ui.ITemplateControl are responsible for creating DOM.
            */
            compile(nodes: Node[], control?: ui.ITemplateControl): any;
            /**
            * Goes through the NodeList, finding elements that contain controls as well as
            * text that contains markup.
            *
            * @param nodes The NodeList to be compiled.
            * @param control The parent control for the given NodeList. The parent must implement ui.ITemplateControl
            * since only controls that implement ui.ITemplateControl are responsible for creating DOM.
            */
            compile(nodes: NodeList, control?: ui.ITemplateControl): void;
        }
        /**
        * A NodeManager is responsible for data binding a data context to a Node.
        */
        class NodeManager implements INodeManager {
            static $regex: expressions.IRegex;
            static $ContextManagerStatic: observable.IContextManagerStatic;
            static $parser: expressions.IParser;
            static $ExceptionStatic: IExceptionStatic;
            static $TemplateControlStatic: ui.ITemplateControlStatic;
            /**
            * The start markup notation.
            */
            static startSymbol: string;
            /**
            * The end markup notation.
            */
            static endSymbol: string;
            /**
            * Given an IParsedExpression array, creates an array of unique identifers
            * to use with binding. This allows us to avoid creating multiple listeners
            * for the identifier and node.
            *
            * @static
            * @param expressions An IParsedExpression array to search for identifiers.
            * @return {Array<string>} An array of identifiers.
            */
            static findUniqueIdentifiers(expressions: expressions.IParsedExpression[]): any[];
            /**
            * Determines if a string has the markup notation.
            *
            * @param text The text string in which to search for markup.
            * @return {Boolean} Indicates whether or not there is markup.
            */
            static hasMarkup(text: string): boolean;
            /**
            * Given a string, finds markup in the string and creates an IParsedExpression array.
            *
            * @static
            * @param text The text string to parse.
            */
            static findMarkup(text: string): expressions.IParsedExpression[];
            /**
            * Takes in data context and an IParsedExpression array and outputs a string of the evaluated
            * expressions.
            *
            * @static
            * @param expressions The IParsedExpression array to evaluate.
            * @param control The IControl used to parse the expressions.
            * @return {string} The evaluated expressions.
            */
            static build(expressions: expressions.IParsedExpression[], control?: ui.ITemplateControl): string;
            /**
            * Registers a listener to be notified of a change in any associated identifier.
            *
            * @static
            * @param identifiers An Array of identifiers to observe.
            * @param control The control associated to the identifiers.
            * @param listener The listener to call when any identifier property changes.
            */
            static observeIdentifiers(identifiers: string[], control: ui.ITemplateControl, listener: (...args: any[]) => void): void;
            /**
            * Wraps constant text as an IParsedExpression.
            *
            * @param text The text to wrap.
            */
            static _wrapExpression(text: string): expressions.IParsedExpression;
            /**
            * Specifies the type of NodeManager.
            */
            public type: string;
            /**
            * Lets us know when an ElementManager is a cloned manager, or the compiled
            * manager from BindableTemplates. We do not want to bindAndLoad compiled
            * managers that are clones.
            */
            public isClone: boolean;
            /**
            * The INodeMap associated with this NodeManager. We have to use an
            * INodeMap instead of an INode so we can treat all INodeManagers the same.
            */
            public nodeMap: INodeMap;
            /**
            * The parent ElementManager for this NodeManager.
            */
            public parent: IElementManager;
            /**
            * Initiailzes this ElementManger instance.
            *
            * @param nodeMap The INodeMap associated with this NodeManager. We have to use an
            * INodeMap instead of an INode so we can treat all INodeManagers the same.
            * @param parent The parent ElementManager for this NodeManager.
            */
            public initialize(nodeMap: INodeMap, parent: IElementManager): void;
            /**
            * Retrieves the parent control for this NodeManager.
            */
            public getParentControl(): ui.ITemplateControl;
            /**
            * Clones this NodeManager with the new node.
            *
            * @param newNode The node used to clone this NodeManager.
            * @param parentManager The parent NodeManager for the clone.
            */
            public clone(newNode: Node, parentManager: IElementManager): number;
            /**
            * The function used for data-binding a data context to the DOM.
            */
            public bind(): void;
        }
        /**
        * The Type for referencing the '$NodeManagerStatic' injectable as a dependency.
        */
        function NodeManagerStatic($regex: any, $ContextManagerStatic: any, $parser: any, $ExceptionStatic: any, $TemplateControlStatic: any): typeof NodeManager;
        /**
        * Describes an object that takes a Node and provides a way to data-bind to that node.
        */
        interface INodeManager {
            /**
            * The type of INodeManager
            */
            type: string;
            /**
            * The INodeMap for this INodeManager. Contains the compiled Node.
            */
            nodeMap?: INodeMap;
            /**
            * The parent manager for this INodeManager.
            */
            parent?: IElementManager;
            /**
            * Retrieves the parent control associated with the parent manager.
            */
            getParentControl? (): ui.ITemplateControl;
            /**
            * Clones this NodeManager with the new node.
            *
            * @param newNode The node used to clone this NodeManager.
            * @param parentManager The parent IElementManager for the clone.
            */
            clone? (newNode: Node, parentManager: IElementManager): number;
            /**
            * Initializes the object's properties.
            *
            * @param nodeMap The INodeMap associated with this TextManager. We have to use an
            * INodeMap instead of an INode so we can treat all INodeManagers the same.
            * @param parent The parent IElementManager.
            */
            initialize? (nodeMap: INodeMap, parent: IElementManager): void;
            /**
            * The function used for data-binding a data context to the DOM.
            */
            bind(): void;
        }
        /**
        * Describes a compiled Node.
        */
        interface INode {
            /**
            * The control associated with the Node, if one exists.
            */
            control?: IControl;
            /**
            * The Node that is compiled.
            */
            node?: Node;
            /**
            * The name of the Node.
            */
            nodeName?: string;
            /**
            * Any IParsedExpressions contained in the Node.
            */
            expressions?: expressions.IParsedExpression[];
            /**
            * Unique identifiers contained in the Node.
            */
            identifiers?: string[];
            /**
            * The injector for a control associated with the Node, if one exists.
            */
            injector?: dependency.IInjector<IControl>;
        }
        /**
        * Defines the interface for a compiled HTMLElement.
        */
        interface IUiControlNode extends INode {
            /**
            * The control associated with the HTMLElement, if one exists.
            */
            control: ui.ITemplateControl;
            /**
            * The resources element defined as the control element's first
            * element child.
            */
            resourceElement?: HTMLElement;
        }
        /**
        * Describes a compiled HTMLElement with all
        * associated nodes contained within its tag.
        */
        interface INodeMap {
            /**
            * The HTMLElement that is compiled.
            */
            element?: HTMLElement;
            /**
            * The compiled attribute Nodes for the HTMLElement
            */
            nodes: INode[];
            /**
            * An object of key/value attribute pairs.
            */
            attributes?: IObject<string>;
            /**
            * The plat-context path for the next UIControl, if specified.
            */
            childContext?: string;
            /**
            * Indicates whether or not a IControl was found on the HTMLElement.
            */
            hasControl?: boolean;
            /**
            * The INode for the UIControl, if one was found for the HTMLElement.
            */
            uiControlNode?: IUiControlNode;
        }
        /**
        * The external interface for the '$NodeManagerStatic' injectable.
        */
        interface INodeManagerStatic {
            /**
            * The start markup notation.
            */
            startSymbol: string;
            /**
            * The end markup notation.
            */
            endSymbol: string;
            /**
            * The regular expression for finding markup in a string.
            */
            markupRegex: RegExp;
            /**
            * Given an IParsedExpression array, creates an array of unique identifers
            * to use with binding. This allows us to avoid creating multiple listeners
            * for the identifier and node.
            *
            * @static
            * @param expressions An IParsedExpression array to search for identifiers.
            * @return {Array<string>} An array of identifiers.
            */
            findUniqueIdentifiers(expressions: expressions.IParsedExpression[]): string[];
            /**
            * Determines if a string has the markup notation.
            *
            * @param text The text string in which to search for markup.
            * @return {Boolean} Indicates whether or not there is markup.
            */
            hasMarkup(text: string): boolean;
            /**
            * Given a string, finds markup in the string and creates an IParsedExpression array.
            *
            * @static
            * @param text The text string to parse.
            * @return {Array<IParsedExpression>}
            */
            findMarkup(text: string): expressions.IParsedExpression[];
            /**
            * Takes in data context and an IParsedExpression array and outputs a string of the evaluated
            * expressions.
            *
            * @static
            * @param expressions The IParsedExpression array to evaluate.
            * @param control The IControl used to parse the expressions.
            * @return {string} The evaluated expressions.
            */
            build(expressions: expressions.IParsedExpression[], control?: ui.ITemplateControl): string;
            /**
            * Registers a listener to be notified of a change in any associated identifier.
            *
            * @static
            * @param identifiers An Array of identifiers to observe.
            * @param control The control associated to the identifiers.
            * @param listener The listener to call when any identifier property changes.
            */
            observeIdentifiers(identifiers: string[], control: ui.ITemplateControl, listener: (...args: any[]) => void): void;
        }
        /**
        * A class used to manage element nodes. Provides a way for compiling and binding the
        * element/template. Also provides methods for cloning an ElementManager.
        */
        class ElementManager extends NodeManager implements IElementManager {
            static $dom: ui.IDom;
            static $document: Document;
            static $ManagerCacheStatic: storage.ICache<IElementManager>;
            static $ResourcesStatic: ui.IResourcesStatic;
            static $BindableTemplatesStatic: ui.IBindableTemplatesStatic;
            /**
            * Determines if the associated HTMLElement has controls that need to be instantiated or Attr nodes
            * containing text markup. If controls exist or markup is found a new ElementManager will be created,
            * else an empty INodeManager will be added to the Array of INodeManagers.
            *
            * @static
            * @param element The HTMLElement to use to identifier markup and controls.
            * @param parent The parent ui.ITemplateControl used for context inheritance.
            */
            static create(element: HTMLElement, parent?: IElementManager): ElementManager;
            /**
            * Clones an ElementManager with a new element.
            *
            * @static
            * @param sourceManager The original IElementManager.
            * @param parent The parent IElementManager for the new clone.
            * @param element The new element to associate with the clone.
            * @param newControl An optional control to associate with the clone.
            * @param nodeMap The nodeMap used to clone this ElementManager.
            */
            static clone(sourceManager: IElementManager, parent: IElementManager, element: HTMLElement, newControl?: ui.ITemplateControl, nodeMap?: INodeMap): ElementManager;
            /**
            * Clones a UI Control with a new nodeMap.
            *
            * @static
            * @param sourceMap The source INodeMap used to clone the UI Control
            * @param parent The parent control of the clone.
            */
            static cloneUiControl(sourceMap: INodeMap, parent: ui.ITemplateControl): ui.ITemplateControl;
            /**
            * Creates new nodes for an INodeMap corresponding to the element associated with the nodeMap or
            * the passed-in element.
            *
            * @static
            * @param nodeMap The nodeMap to populate with attribute nodes.
            * @param parent The parent control for the new attribute controls.
            * @param templateControl The TemplateControl linked to these AttributeControls if
            * one exists.
            * @param newElement An optional element to use for attributes (used in cloning).
            * @param isClone Whether or not these controls are clones.
            */
            static createAttributeControls(nodeMap: INodeMap, parent: ui.ITemplateControl, templateControl?: ui.ITemplateControl, newElement?: HTMLElement, isClone?: boolean): INode[];
            /**
            * Returns an instance of an ElementManager.
            */
            static getInstance(): ElementManager;
            /**
            * Iterates over the attributes NamedNodeMap, creating an INodeMap. The INodeMap
            * will contain injectors for all the IControls as well as parsed expressions
            * and identifiers found for each Attribute (useful for data binding).
            *
            * @static
            * @param attributes A NamedNodeMap to compile into an INodeMap
            * @return {INodeMap} The compiled NamedNodeMap
            */
            static _collectAttributes(attributes: NamedNodeMap): INodeMap;
            /**
            * Used to copy the attribute nodes during the cloning process.
            *
            * @static
            * @param nodes The compiled INodes to be cloned.
            * @return {INodeMap} The cloned array of INodes.
            */
            static _copyAttributeNodes(nodes: INode[]): INode[];
            /**
            * Clones an INode with a new node.
            *
            * @static
            * @param sourceNode The original INode.
            * @param node The new node used for cloning.
            * @param newControl An optional new control to associate with the cloned node.
            * @return {INode} The clones INode.
            */
            static _cloneNode(sourceNode: INode, node: Node, newControl?: ui.ITemplateControl): INode;
            /**
            * Clones an INodeMap with a new element.
            *
            * @static
            * @param sourceMap The original INodeMap.
            * @param element The new HTMLElement used for cloning.
            * @param newControl An optional new control to associate with the element.
            * @return {INodeMap} The cloned INodeMap.
            */
            static _cloneNodeMap(sourceMap: INodeMap, element: HTMLElement, parent: ui.ITemplateControl, newControl?: ui.ITemplateControl): INodeMap;
            /**
            * The child managers for this manager.
            */
            public children: INodeManager[];
            /**
            * The type of INodeManager.
            */
            public type: string;
            /**
            * Specifies whether or not this manager has a uiControl which has
            * replaceWith set to null or empty string.
            */
            public replace: boolean;
            /**
            * The length of a replaced control, indicates the number of nodes to slice
            * out of the parent's childNodes.
            */
            public replaceNodeLength: number;
            /**
            * Indicates whether the control for this manager hasOwnContext.
            */
            public hasOwnContext: boolean;
            /**
            * In the event that a control hasOwnContext, we need a promise to fullfill
            * when the control is loaded to avoid loading its parent control first.
            */
            public loadedPromise: async.IPromise<void, Error>;
            /**
            * A templatePromise set when a uiControl specifies a templateUrl.
            */
            public templatePromise: async.IPromise<DocumentFragment, async.IAjaxError>;
            public $ElementManagerStatic: IElementManagerStatic;
            public $PromiseStatic: async.IPromiseStatic;
            public $compiler: ICompiler;
            public $NodeManagerStatic: INodeManagerStatic;
            public $ContextManagerStatic: observable.IContextManagerStatic;
            public $CommentManagerStatic: ICommentManagerStatic;
            public $ExceptionStatic: IExceptionStatic;
            public $ControlStatic: IControlStatic;
            public $TemplateControlStatic: ui.ITemplateControlStatic;
            /**
            * Clones this ElementManager with a new node.
            *
            * @param newNode The new element used to clone the ElementManager.
            * @param parentManager The parent for the clone.
            * @param nodeMap An optional INodeMap to clone a ui control if needed.
            */
            public clone(newNode: Node, parentManager: IElementManager, nodeMap?: INodeMap): number;
            /**
            * Initializes all the controls associated to the ElementManager's nodeMap.
            * The INodeManager array must be passed in because if this ElementManager is
            * used for transclusion, it can't rely on one INodeManager array.
            *
            * @param parent The parent IElementManager.
            * @param dontInitialize Specifies whether or not the initialize method should
            * be called for a control.
            * @param dontInitialize Specifies whether or not the initialize method should
            * be called for a control.
            */
            public initialize(nodeMap: INodeMap, parent: IElementManager, dontInitialize?: boolean): void;
            /**
            * Links the data context to the DOM (data-binding).
            */
            public bind(): void;
            /**
            * Sets the template for an ElementManager by calling its associated UI Control's
            * setTemplate method.
            *
            * @param templateUrl An optional templateUrl used to override the control's template.
            */
            public setUiControlTemplate(templateUrl?: string): async.IPromise<DocumentFragment, async.IAjaxError>;
            /**
            * Retrieves the UI control instance for this ElementManager.
            */
            public getUiControl(): ui.ITemplateControl;
            /**
            * Fullfills any template template promises and finishes the compile phase
            * for the template associated to this ElementManager.
            *
            * @return {async.IPromise} A promise, fulfilled when the template
            * is complete.
            */
            public fulfillTemplate(): async.IPromise<any, Error>;
            /**
            * Binds context to the DOM and loads controls.
            */
            public bindAndLoad(): async.IPromise<void, Error>;
            /**
            * Observes the root context for controls that specify their own context, and initiates
            * a load upon a successful set of the context.
            *
            * @param root The ITemplateControl specifying its own context.
            * @param loadMethod The function to initiate the loading of the root control and its
            * children.
            */
            public observeRootContext(root: ui.ITemplateControl, loadMethod: () => async.IPromise<void, Error>): void;
            /**
            * Observes the identifiers associated with this ElementManager's INodes.
            *
            * @param nodes The array of INodes to iterate through.
            * @param parent The parent ITemplateControl for context.
            * @param controls The array of controls whose attributes will need to be updated
            * upon the context changing.
            */
            public _observeControlIdentifiers(nodes: INode[], parent: ui.ITemplateControl, controls: IControl[]): void;
            /**
            * Loads the AttributeControls associated with this ElementManager and
            * attaches the corresponding ITemplateControl if available.
            *
            * @param controls The array of controls to load.
            * @param templateControl The ITemplateControl associated with this
            * ElementManager.
            */
            public _loadAttributeControls(controls: controls.IAttributeControl[], templateControl: ui.ITemplateControl): void;
            /**
            * Fulfills the template promise prior to binding and loading the control.
            */
            public _fulfillAndLoad(): async.IPromise<void, Error>;
            /**
            * Populates the ITemplateControl properties associated with this ElementManager
            * if one exists.
            */
            public _populateUiControl(): void;
            /**
            * Removes the ITemplateControl's element. Called if its replaceWith property is
            * null or empty string.
            *
            * @param control The ITemplateControl whose element will be removed.
            * @param nodeMap The INodeMap associated with this ElementManager.
            */
            public _replaceElement(control: ui.ITemplateControl, nodeMap: INodeMap): void;
            /**
            * Looks through the HTMLElement's child nodes to try and find any
            * defined Resources in a <plat-resources> tags.
            *
            * @param node The node who has may have Resources as a child node.
            */
            public _locateResources(node: Node): HTMLElement;
            /**
            * Initializes a control's template and compiles the control.
            *
            * @param uiControl The ITemplateControl associated with this ElementManager.
            * @param template The uiControl's template.
            */
            public _initializeControl(uiControl: ui.ITemplateControl, template: DocumentFragment): void;
            /**
            * A function to handle updating an attribute on all controls that have it
            * as a property upon a change in its value.
            *
            * @param node The INode where the change occurred.
            * @param parent The parent ITemplateControl used for context.
            * @param controls The controls that have the changed attribute as a property.
            */
            public _attributeChanged(node: INode, parent: ui.ITemplateControl, controls: IControl[]): void;
        }
        /**
        * The Type for referencing the '$ElementManagerStatic' injectable as a dependency.
        */
        function ElementManagerStatic($dom: any, $document: any, $ManagerCacheStatic: any, $ResourcesStatic: any, $BindableTemplatesStatic: any): typeof ElementManager;
        /**
        * An ElementManager is responsible for initializing and data-binding controls associated to an HTMLElement.
        *
        */
        interface IElementManager extends INodeManager {
            /**
            * The child managers for this manager.
            */
            children: INodeManager[];
            /**
            * Specifies whether or not this manager has a uiControl which has
            * replaceWith set to null or empty string.
            */
            replace: boolean;
            /**
            * The length of a replaced control, indiates the number of nodes to slice
            * out of the parent's childNodes.
            */
            replaceNodeLength: number;
            /**
            * Indicates whether the control for this manager hasOwnContext.
            */
            hasOwnContext: boolean;
            /**
            * Lets us know when an ElementManager is a cloned manager, or the compiled
            * manager from BindableTemplates. We do not want to bindAndLoad compiled
            * managers that are clones.
            */
            isClone: boolean;
            /**
            * In the event that a control hasOwnContext, we need a promise to fullfill
            * when the control is loaded to avoid loading its parent control first.
            */
            loadedPromise: async.IPromise<void, Error>;
            /**
            * A templatePromise set when a uiControl specifies a templateUrl.
            */
            templatePromise: async.IPromise<DocumentFragment, async.IAjaxError>;
            /**
            * Clones the IElementManager with a new node.
            *
            * @param newNode The new element used to clone the ElementManager.
            * @param parentManager The parent for the clone.
            * @param nodeMap An optional INodeMap to clone a ui control if needed.
            */
            clone(newNode: Node, parentManager: IElementManager, nodeMap?: INodeMap): number;
            /**
            * Initializes all the controls associated to the ElementManager's nodeMap.
            * The INodeManager array must be passed in because if this ElementManager is
            * used for transclusion, it can't rely on one INodeManager array.
            *
            * @param parent The parent IElementManager.
            * @param dontInitialize Specifies whether or not the initialize method should
            * be called for a control.
            * @param dontInitialize Specifies whether or not the initialize method should
            * be called for a control.
            */
            initialize(nodeMap: INodeMap, parent: IElementManager, dontInitialize?: boolean): void;
            /**
            * Observes the root context for controls that specify their own context, and initiates
            * a load upon a successful set of the context.
            *
            * @param root The ITemplateControl specifying its own context.
            * @param loadMethod The function to initiate the loading of the root control and its
            * children.
            */
            observeRootContext(root: ui.ITemplateControl, loadMethod: () => async.IPromise<void, Error>): void;
            /**
            * Links the data context to the DOM (data-binding).
            */
            bind(): void;
            /**
            * Sets the template for an ElementManager by calling its associated UI Control's
            * setTemplate method.
            *
            * @param templateUrl An optional templateUrl used to override the control's template.
            */
            setUiControlTemplate(templateUrl?: string): void;
            /**
            * Retrieves the UI control instance for this ElementManager.
            */
            getUiControl(): ui.ITemplateControl;
            /**
            * Fullfills any template template promises and finishes the compile phase
            * for the template associated to this ElementManager.
            *
            * @return {async.IPromise} A promise, fulfilled when the template
            * is complete.
            */
            fulfillTemplate(): async.IPromise<any, Error>;
            /**
            * Binds context to the DOM and loads controls.
            */
            bindAndLoad(): async.IPromise<void, Error>;
        }
        /**
        * The external interface for the '$ElementManagerStatic' injectable.
        */
        interface IElementManagerStatic {
            /**
            * Determines if the associated HTMLElement has controls that need to be instantiated or Attr nodes
            * containing text markup. If controls exist or markup is found a new ElementManager will be created,
            * else an empty INodeManager will be added to the Array of INodeManagers.
            *
            * @static
            * @param element The HTMLElement to use to identifier markup and controls.
            * @param parent The parent ui.ITemplateControl used for context inheritance.
            */
            create(element: HTMLElement, parent?: IElementManager): IElementManager;
            /**
            * Creates new nodes for an INodeMap corresponding to the element associated with the nodeMap or
            * the passed-in element.
            *
            * @param nodeMap The nodeMap to populate with attribute nodes.
            * @param parent The parent control for the new attribute controls.
            * @param templateControl The TemplateControl linked to these AttributeControls if
            * one exists.
            * @param newElement An optional element to use for attributes (used in cloning).
            * @param isClone Whether or not these controls are clones.
            */
            createAttributeControls(nodeMap: INodeMap, parent: ui.ITemplateControl, templateControl?: ui.ITemplateControl, newElement?: HTMLElement, isClone?: boolean): INode[];
            /**
            * Clones a UI Control with a new nodeMap.
            *
            * @param sourceMap The source INodeMap used to clone the UI Control
            * @param parent The parent control of the clone.
            */
            cloneUiControl(sourceMap: INodeMap, parent: ui.ITemplateControl): ui.ITemplateControl;
            /**
            * Clones an ElementManager with a new element.
            *
            * @param sourceManager The original IElementManager.
            * @param parent The parent IElementManager for the new clone.
            * @param element The new element to associate with the clone.
            * @param newControl An optional control to associate with the clone.
            * @param nodeMap The nodeMap used to clone this ElementManager.
            */
            clone(sourceManager: IElementManager, parent: IElementManager, element: HTMLElement, newControl?: ui.ITemplateControl, nodeMap?: INodeMap): IElementManager;
            /**
            * Returns a new instance of an IElementManager
            */
            getInstance(): IElementManager;
        }
        /**
        * The class responsible for initializing and data-binding values to text nodes.
        */
        class TextManager extends NodeManager implements ITextManager {
            /**
            * Determines if a text node has markup, and creates a TextManager if it does.
            * A TextManager or empty TextManager will be added to the managers array.
            *
            * @static
            * @param node The Node used to find markup.
            * @param parent The parent ITemplateControl for the node.
            */
            static create(node: Node, parent: IElementManager): TextManager;
            /**
            * Clones an INodeMap with a new text node.
            *
            * @static
            * @param sourceMap The original INodeMap.
            * @param newNode The new text node used for cloning.
            */
            static _cloneNodeMap(sourceMap: INodeMap, newNode: Node): INodeMap;
            /**
            * Clones a TextManager with a new text node.
            *
            * @static
            * @param sourceManager The original INodeManager.
            * @param node The new text node to associate with the clone.
            * @param parent The parent IElementManager for the new clone.
            */
            static _clone(sourceManager: INodeManager, node: Node, parent: IElementManager): TextManager;
            /**
            * Specifies the type for this INodeManager.
            */
            public type: string;
            /**
            * Clones this TextManager with a new node.
            *
            * @param newNode The new node attached to the cloned TextManager.
            * @param parentManager The parent ElementManager for the clone.
            */
            public clone(newNode: Node, parentManager: IElementManager): number;
            /**
            * The function used for data-binding a data context to the DOM.
            */
            public bind(): void;
            /**
            * Builds the node expression and sets the value.
            *
            * @param Node The associated node whose value will be set.
            * @param control The control whose context will be used to bind
            * the data.
            * @param expressions An array of parsed expressions used to build
            * the node value.
            */
            public _setText(node: Node, control: ui.ITemplateControl, expressions: expressions.IParsedExpression[]): void;
        }
        /**
        * The Type for referencing the '$TextManageStatic' injectable as a dependency.
        */
        function TextManagerStatic(): typeof TextManager;
        /**
        * An object responsible for initializing and data-binding values to text nodes.
        */
        interface ITextManager extends INodeManager {
            /**
            * Clones this ITextManager with a new node.
            *
            * @param newNode The new node attached to the cloned ITextManager.
            * @param parentManager The parent IElementManager for the clone.
            */
            clone(newNode: Node, parentManager: IElementManager): number;
            /**
            * The function used for data-binding a data context to the DOM.
            */
            bind(): any;
        }
        /**
        * The external interface for the '$TextManageStatic' injectable.
        */
        interface ITextManagerStatic {
            /**
            * Determines if a text node has markup, and creates a TextManager if it does.
            * A TextManager or empty TextManager will be added to the managers array.
            *
            * @static
            * @param node The Node used to find markup.
            * @param parent The parent ui.ITemplateControl for the node.
            */
            create(node: Node, parent?: IElementManager): ITextManager;
        }
        /**
        * A class used to manage Comment nodes. Provides a way to
        * clone a Comment node.
        */
        class CommentManager extends NodeManager implements ICommentManager {
            /**
            * Creates a new CommentManager for the given Comment node.
            *
            * @static
            * @param node The Comment to associate with the new manager.
            * @param parent The parent IElementManager.
            */
            static create(node: Node, parent: IElementManager): void;
            /**
            * Specifies the type of INodeManager.
            */
            public type: string;
            /**
            * A method for cloning this CommentManager.
            *
            * @param newNode The new Comment node to associate with the cloned
            * manager.
            * @param parentManager The parent IElementManager for the new clone.
            */
            public clone(newNode: Node, parentManager: IElementManager): number;
        }
        /**
        * The Type for referencing the '$CommentManagerStatic' injectable as a dependency.
        */
        function CommentManagerStatic(): typeof CommentManager;
        /**
        * An object used to manage Comment nodes.
        */
        interface ICommentManager extends INodeManager {
            /**
            * A method for cloning this CommentManager.
            *
            * @param newNode The new Comment node to associate with the cloned
            * manager.
            * @param parentManager The parent IElementManager for the new clone.
            */
            clone(newNode: Node, parentManager: IElementManager): number;
        }
        /**
        * The external interface for the '$CommentManagerStatic' injectable.
        */
        interface ICommentManagerStatic {
            /**
            * Creates a new CommentManager for the given Comment node.
            *
            * @static
            * @param node The Comment to associate with the new manager.
            * @param parent The parent IElementManager.
            */
            create(node: Node, parent: IElementManager): ICommentManager;
        }
    }
    module navigation {
        /**
        * A class that defines the base Navigation properties and methods.
        */
        class BaseNavigator implements IBaseNavigator {
            /**
            * A unique identifier used to identify this navigator.
            */
            public uid: string;
            /**
            * Every navigator will have a viewport with which to communicate and
            * facilitate navigation.
            */
            public baseport: ui.controls.IBaseport;
            /**
            * Specifies the current state of navigation. This state should contain
            * enough information for it to be pushed onto the history stack when
            * necessary.
            */
            public currentState: IBaseNavigationState;
            public $EventManagerStatic: events.IEventManagerStatic;
            public $NavigationEventStatic: events.INavigationEventStatic;
            public $ExceptionStatic: IExceptionStatic;
            public $ViewControlStatic: ui.IViewControlStatic;
            public $ContextManagerStatic: observable.IContextManagerStatic;
            constructor();
            /**
            * Initializes a Navigator. The viewport will call this method and pass itself in so
            * the navigator can store it and use it to facilitate navigation.
            *
            * @param baseport The baseport instance this navigator will be attached to.
            */
            public initialize(baseport: ui.controls.IBaseport): void;
            /**
            * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
            * navigation parameters to be sent to the new ui.IViewControl.
            *
            * @param navigationParameter An optional navigation parameter to send to the next ui.IViewControl.
            * @param options Optional IBaseNavigationOptions used for navigation.
            */
            public navigate(navigationParameter: any, options: IBaseNavigationOptions): void;
            /**
            * Called by the Viewport to make the Navigator aware of a successful navigation. The Navigator will
            * in-turn call the app.navigated event.
            *
            * @param control The ui.IViewControl to which the navigation occurred.
            * @param parameter The navigation parameter sent to the control.
            * @param options The INavigationOptions used during navigation.
            */
            public navigated(control: ui.IViewControl, parameter: any, options: IBaseNavigationOptions): void;
            /**
            * Every navigator must implement this method, defining what happens when a view
            * control wants to go back.
            *
            * @param options Optional backwards navigation options of type IBaseBackNavigationOptions.
            */
            public goBack(options?: IBaseBackNavigationOptions): void;
            /**
            * Sends a NavigationEvent with the given parameters.  The 'sender' property of the event will be the
            * navigator.
            *
            * @param name The name of the event to send.
            * @param target The target of the event, could be a view control or a route depending upon the navigator and
            * event name.
            * @param options The IBaseNavigationOptions used during navigation
            * @param cancelable Whether or not the event can be canceled, preventing further navigation.
            */
            public _sendEvent(name: string, target: any, type: string, parameter: any, options: IBaseNavigationOptions, cancelable: boolean): events.INavigationEvent<any, any, BaseNavigator>;
        }
        /**
        * Options that you can submit to the navigator in order
        * to customize navigation.
        */
        interface IBaseNavigationOptions {
            /**
            * Allows a ui.IViewControl to leave itself out of the
            * navigation history.
            */
            replace?: boolean;
        }
        /**
        * Options that you can submit to the navigator during a backward
        * navigation in order to customize the navigation.
        */
        interface IBaseBackNavigationOptions {
            /**
            * Lets the Navigator know to navigate back a specific length
            * in history.
            */
            length?: number;
        }
        /**
        * Defines the base interface needing to be implemented in the history.
        */
        interface IBaseNavigationState {
            /**
            * The view control associated with a history entry.
            */
            control: ui.IViewControl;
        }
        /**
        * Defines the methods that a Navigator must implement.
        */
        interface IBaseNavigator {
            /**
            * A unique identifier used to identify this navigator.
            */
            uid: string;
            /**
            * Every navigator will have a viewport with which to communicate and
            * facilitate navigation.
            */
            baseport: ui.controls.IBaseport;
            /**
            * Specifies the current state of navigation. This state should contain
            * enough information for it to be pushed onto the history stack when
            * necessary.
            */
            currentState: IBaseNavigationState;
            /**
            * Initializes a Navigator. The viewport will call this method and pass itself in so
            * the navigator can store it and use it to facilitate navigation.
            *
            * @param baseport The baseport instance this navigator will be attached to.
            */
            initialize(baseport: ui.controls.IBaseport): void;
            /**
            * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
            * navigation parameters to be sent to the new ui.IViewControl.
            *
            * @param navigationParameter An optional navigation parameter to send to the next ui.IViewControl.
            * @param options Optional IBaseNavigationOptions used for navigation.
            */
            navigate(navigationParameter: any, options?: IBaseNavigationOptions): void;
            /**
            * Called by the Viewport to make the Navigator aware of a successful navigation. The Navigator will
            * in-turn call the app.navigated event.
            *
            * @param control The ui.IViewControl to which the navigation occurred.
            * @param parameter The navigation parameter sent to the control.
            * @param options The INavigationOptions used during navigation.
            */
            navigated(control: ui.IViewControl, parameter: any, options: IBaseNavigationOptions): void;
            /**
            * Every navigator must implement this method, defining what happens when a view
            * control wants to go back.
            *
            * @param options Optional backwards navigation options of type IBaseBackNavigationOptions.
            */
            goBack(options?: IBaseBackNavigationOptions): void;
        }
        /**
        * The Navigator class allows ui.IViewControls to navigate within a Viewport.
        * Every Viewport has its own Navigator instance, allowing multiple navigators to
        * coexist in one app.
        */
        class Navigator extends BaseNavigator implements INavigator {
            /**
            * Contains the navigation history stack.
            */
            public history: IBaseNavigationState[];
            /**
            * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
            * navigation parameters to be sent to the new ui.IViewControl.
            *
            * @param Constructor The Constructor for the new ui.IViewControl. The Navigator will find the injector
            * for the Constructor and create a new instance of the control.
            * @param options Optional IBaseNavigationOptions used for Navigation.
            */
            public navigate(Constructor?: new(...args: any[]) => ui.IViewControl, options?: INavigationOptions): any;
            public navigate(injector?: dependency.IInjector<IControl>, options?: INavigationOptions): any;
            /**
            * Returns to the last visited ui.IViewControl.
            *
            * @param options Optional IBackNavigationOptions allowing the ui.IViewControl
            * to customize navigation. Enables navigating back to a specified point in history as well
            * as specifying a new templateUrl to use at the next ui.IViewControl.
            */
            public goBack(options?: IBackNavigationOptions): void;
            /**
            * Lets the caller know if there are ui.IViewControls in the history, meaning the caller
            * is safe to perform a backward navigation.
            */
            public canGoBack(): boolean;
            /**
            * Clears the navigation history, disposing all the controls.
            */
            public clearHistory(): void;
            /**
            * Finds the given constructor in the history stack. Returns the index in the history where
            * the constructor is found, or -1 if no constructor is found.
            *
            * @param Constructor The view control constructor to search for in the history stack.
            */
            public _findInHistory(Constructor: new(...args: any[]) => ui.IViewControl): number;
            /**
            * This method takes in a length and navigates back in the history, returning the view control
            * associated with length + 1 entries back in the history.  It disposes all the view controls
            * encapsulated in the length.
            */
            public _goBackLength(length?: number): IBaseNavigationState;
        }
        /**
        * Options that you can submit to the Navigator in order
        * to customize navigation.
        */
        interface INavigationOptions extends IBaseNavigationOptions {
            /**
            * An optional parameter to send to the next ui.IViewControl.
            */
            parameter?: any;
        }
        /**
        * Options that you can submit to the Navigator during a backward
        * navigation in order to customize the navigation.
        */
        interface IBackNavigationOptions extends IBaseBackNavigationOptions {
            /**
            * An optional parameter to send to the next ui.IViewControl.
            */
            parameter?: any;
            /**
            * A ui.IViewControl Constructor that the Navigator will
            * use to navigate. The Navigator will search for an instance
            * of the ui.IViewControl in its history and navigate to it.
            */
            ViewControl?: new(...args: any[]) => ui.IViewControl;
        }
        /**
        * An object implementing INavigator allows ui.IViewControls to implement methods
        * used to navigate within a Viewport.
        */
        interface INavigator extends IBaseNavigator {
            /**
            * Contains the navigation history stack for the associated Viewport.
            */
            history: IBaseNavigationState[];
            /**
            * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
            * navigation parameters to be sent to the new ui.IViewControl.
            *
            * @param Constructor The Constructor for the new ui.IViewControl. The Navigator will find the injector
            * for the Constructor and create a new instance of the control.
            * @param options Optional IBaseNavigationOptions used for Navigation.
            */
            navigate(Constructor?: new(...args: any[]) => ui.IViewControl, options?: INavigationOptions): void;
            navigate(injector?: dependency.IInjector<IControl>, options?: INavigationOptions): void;
            /**
            * Returns to the last visited ui.IViewControl.
            *
            * @param options Optional IBackNavigationOptions allowing the ui.IViewControl
            * to customize navigation. Enables navigating back to a specified point in history as well
            * as specifying a new templateUrl to use at the next ui.IViewControl.
            */
            goBack(options?: IBackNavigationOptions): void;
            /**
            * Lets the caller know if there are ui.IViewControls in the history, meaning the caller
            * is safe to perform a backward navigation.
            */
            canGoBack(): boolean;
            /**
            * Clears the navigation history, disposing all the controls.
            */
            clearHistory(): void;
        }
        /**
        * A Navigator class that utilizes routing capabilities. It is associated with a
        * Routeport, thus only allowing one RoutingNavigator per app.
        */
        class RoutingNavigator extends BaseNavigator implements IRoutingNavigator {
            /**
            * The routing information for the Routeport's current state.
            */
            public currentState: IRouteNavigationState;
            public $browser: web.IBrowser;
            public $router: web.IRouter;
            public $window: Window;
            private __removeListeners;
            private __historyLength;
            constructor();
            /**
            * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
            * navigation parameters to be sent to the new ui.IViewControl.
            *
            * @param path The url path to navigate to.
            * @param options Optional INavigationOptions for ignoring the current ui.IViewControl in the history as
            * well as specifying a new templateUrl for the next ui.IViewControl to use.
            */
            public navigate(path: string, options?: web.IRouteNavigationOptions): void;
            /**
            * Called by the Viewport to make the Navigator aware of a successful navigation. The Navigator will
            * in-turn call the app.navigated event.
            *
            * @param control The ui.IViewControl to which the navigation occurred.
            * @param parameter The navigation parameter sent to the control.
            * @param options The INavigationOptions used during navigation.
            */
            public navigated(control: ui.IViewControl, parameter: web.IRoute<any>, options: web.IRouteNavigationOptions): void;
            /**
            * Returns to the last visited ui.IViewControl based on the previous route.
            *
            * @param options Optional IBackNavigationOptions allowing the ui.IViewControl
            * to customize navigation. Enables navigating back to a specified point in history as well
            * as specifying a new templateUrl to use at the next ui.IViewControl.
            */
            public goBack(options?: IBaseBackNavigationOptions): void;
            /**
            * The method called prior to a route change event.
            *
            * @param ev The INavigationEvent containing information regarding the ViewControl, the routing infomration,
            * and the Router.
            */
            public _beforeRouteChange(ev: events.INavigationEvent<dependency.IInjector<ui.IViewControl>, web.IRoute<any>, web.IRouter>): void;
            /**
            * The method called when a route change is successfully performed and ViewControl navigation can occur.
            *
            * @param ev The INavigationEvent containing information regarding the ViewControl, the routing infomration,
            * and the Router.
            */
            public _onRouteChanged(ev: events.INavigationEvent<dependency.IInjector<ui.IViewControl>, web.IRoute<any>, web.IRouter>): void;
        }
        /**
        * Defines the route type interface implemented for current state and last state.
        */
        interface IRouteNavigationState extends IBaseNavigationState {
            /**
            * The associated route information.
            */
            route: web.IRoute<any>;
        }
        /**
        * Defines the methods that a Navigator must implement if it chooses to utilize
        * routing capabilities.
        */
        interface IRoutingNavigator extends IBaseNavigator {
            /**
            * Allows a ui.IViewControl to navigate to another ui.IViewControl. Also allows for
            * navigation parameters to be sent to the new ui.IViewControl.
            *
            * @param path The url path to navigate to.
            * @param options Optional INavigationOptions for ignoring the current ui.IViewControl in the history as
            * well as specifying a new templateUrl for the next ui.IViewControl to use.
            */
            navigate(path: string, options?: web.IRouteNavigationOptions): void;
            /**
            * Returns to the last visited ui.IViewControl.
            *
            * @param options Optional IBackNavigationOptions allowing the ui.IViewControl
            * to customize navigation. Enables navigating back to a specified point in history as well
            * as specifying a new templateUrl to use at the next ui.IViewControl.
            */
            goBack(options?: IBaseBackNavigationOptions): void;
        }
    }
    /**
    * Class for every app. This class contains hooks for Application Lifecycle Events
    * as well as error handling.
    */
    class App implements IApp {
        static $compat: ICompat;
        static $ExceptionStatic: IExceptionStatic;
        static $EventManagerStatic: events.IEventManagerStatic;
        static $document: Document;
        static $compiler: processing.ICompiler;
        static $LifecycleEventStatic: events.ILifecycleEventStatic;
        /**
        * A static method for initiating the app startup.
        */
        static start(): void;
        /**
        * A static methods called upon app registration. Primarily used
        * to initiate a ready state in the case that amd is being used.
        */
        static registerApp(app: any): void;
        /**
        * Kicks off compilation of the DOM from the specified node. If no node is specified,
        * the default start node is document.body.
        *
        * @param node The node at which DOM compilation begins.
        */
        static load(node?: Node): void;
        /**
        * The instance of the registered IApp.
        */
        static app: IApp;
        /**
        * A static method called when the application is ready. It calls the app instance's
        * ready function as well as checks for the presence of a module loader. If one exists,
        * loading the DOM falls back to the app developer. If it doesn't, the DOM is loaded from
        * document.body.
        */
        private static __ready(ev);
        private static __shutdown();
        private static __registerAppEvents(ev);
        /**
        * A unique id, created during instantiation.
        */
        public uid: string;
        /**
        * Class for every app. This class contains hooks for Application Lifecycle Management (ALM)
        * as well as error handling and navigation events.
        */
        constructor();
        /**
        * Event fired when the app is suspended.
        *
        * @param ev The ILifecycleEvent object.
        */
        public suspend(ev: events.ILifecycleEvent): void;
        /**
        * Event fired when the app resumes from the suspended state.
        *
        * @param ev The ILifecycleEvent object.
        */
        public resume(ev: events.ILifecycleEvent): void;
        /**
        * Event fired when an internal error occures.
        *
        * @param ev The IErrorEvent object.
        */
        public error(ev: events.IErrorEvent<Error>): void;
        /**
        * Event fired when the app is ready.
        *
        * @param ev The ILifecycleEvent object.
        */
        public ready(ev: events.ILifecycleEvent): void;
        /**
        * Event fired when the app regains connectivity and is now in an online state.
        *
        * @param ev The ILifecycleEvent object.
        */
        public online(ev: events.ILifecycleEvent): void;
        /**
        * Event fired when the app loses connectivity and is now in an offline state.
        *
        * @param ev The ILifecycleEvent object.
        */
        public offline(ev: events.ILifecycleEvent): void;
        /**
        * Creates a new DispatchEvent and propagates it to all listeners based on the
        * events.EventManager.DIRECT method. Propagation will always start with the sender,
        * so the sender can both produce and consume the same event.
        *
        * @param name The name of the event to send, cooincides with the name used in the
        * app.on() method.
        * @param ...args Any number of arguments to send to all the listeners.
        */
        public dispatchEvent(name: string, ...args: any[]): void;
        /**
        * Registers a listener for a beforeNavigate event. The listener will be called when a beforeNavigate
        * event is propagating over the app. Any number of listeners can exist for a single event name.
        * This event is cancelable using the ev.cancel() method, and thereby preventing the navigation.
        *
        * @param name='beforeNavigate' The name of the event, cooinciding with the beforeNavigate event.
        * @param listener The method called when the beforeNavigate event is fired.
        */
        public on(name: 'beforeNavigate', listener: (ev: events.INavigationEvent<any, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
        * Registers a listener for a navigating event. The listener will be called when a navigating
        * event is propagating over the app. Any number of listeners can exist for a single event name.
        * This event is cancelable using the ev.cancel() method, and thereby preventing the navigation.
        *
        * @param name='navigating' The name of the event, cooinciding with the navigating event.
        * @param listener The method called when the navigating event is fired.
        */
        public on(name: 'navigating', listener: (ev: events.INavigationEvent<any, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
        * Registers a listener for a navigated event. The listener will be called when a navigated
        * event is propagating over the app. Any number of listeners can exist for a single event name.
        * This event is not cancelable.
        *
        * @param name='navigated' The name of the event, cooinciding with the navigated event.
        * @param listener The method called when the navigated event is fired.
        */
        public on(name: 'navigated', listener: (ev: events.INavigationEvent<ui.IViewControl, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
        * Registers a listener for a routeChange event. The listener will be called when a routeChange event
        * is propagating over the app. Any number of listeners can exist for a single event name.
        *
        * @param eventName='routeChange' This specifies that the listener is for a routeChange event.
        * @param listener The method called when the routeChange is fired. The route argument will contain
        * a parsed route.
        */
        public on(name: 'routeChange', listener: (ev: events.INavigationEvent<any, any, web.IRouter>) => void): IRemoveListener;
        /**
        * Registers a listener for a NavigationEvent. The listener will be called when a NavigationEvent is
        * propagating over the app. Any number of listeners can exist for a single event name.
        *
        * @param name The name of the event, cooinciding with the NavigationEvent name.
        * @param listener The method called when the NavigationEvent is fired.
        */
        public on(name: string, listener: (ev: events.INavigationEvent<any, any, any>) => void): IRemoveListener;
        /**
        * Kicks off compilation of the DOM from the specified node. If no node is specified,
        * the default start node is document.body. This method should be called from the app when
        * using module loaders. If a module loader is in use, the app will delay loading until
        * this method is called.
        *
        * @param node The node where at which DOM compilation begins.
        */
        public load(node?: Node): void;
    }
    /**
    * The external interface for the '$AppStatic' interface.
    */
    interface IAppStatic {
        /**
        * A static method for initiating the app startup.
        */
        start(): void;
        /**
        * A static methods called upon app registration. Primarily used
        * to initiate a ready state in the case that amd is being used.
        */
        registerApp(app: dependency.IInjector<IApp>): void;
        /**
        * Kicks off compilation of the DOM from the specified node. If no node is specified,
        * the default start node is document.body.
        *
        * @param node The node at which DOM compilation begins.
        */
        load(node?: Node): void;
        /**
        * The instance of the registered IApp.
        */
        app: IApp;
    }
    /**
    * The Type for referencing the '$AppStatic' injectable as a dependency.
    */
    function AppStatic($compat: ICompat, $ExceptionStatic: IExceptionStatic, $EventManagerStatic: events.IEventManagerStatic, $document: Document, $compiler: processing.ICompiler, $LifecycleEventStatic: events.ILifecycleEventStatic): typeof App;
    /**
    * The Type for referencing the '$app' injectable as a dependency.
    */
    function AppInstance($AppStatic: IAppStatic): IApp;
    /**
    * An object implementing IApp implements the methods called by the framework to support
    * Application Lifecycle Management (ALM) as well as error handling and navigation events.
    */
    interface IApp {
        /**
        * A unique id, created during instantiation.
        */
        uid: string;
        /**
        * Event fired when the app is suspended.
        *
        * @param ev The ILifecycleEvent object.
        */
        suspend? (ev: events.ILifecycleEvent): void;
        /**
        * Event fired when the app resumes from the suspended state.
        *
        * @param ev The ILifecycleEvent object.
        */
        resume? (ev: events.ILifecycleEvent): void;
        /**
        * Event fired when an internal error occures.
        *
        * @param ev The IErrorEvent object.
        */
        error? (ev: events.IErrorEvent<Error>): void;
        /**
        * Event fired when the app is ready.
        *
        * @param ev The ILifecycleEvent object.
        */
        ready? (ev: events.ILifecycleEvent): void;
        /**
        * Event fired when the app regains connectivity and is now in an online state.
        *
        * @param ev The ILifecycleEvent object.
        */
        online? (ev: events.ILifecycleEvent): void;
        /**
        * Event fired when the app loses connectivity and is now in an offline state.
        *
        * @param ev The ILifecycleEvent object.
        */
        offline? (ev: events.ILifecycleEvent): void;
        /**
        * Creates a new DispatchEvent and propagates it to all listeners based on the
        * events.EventManager.DIRECT method. Propagation will always start with the sender,
        * so the sender can both produce and consume the same event.
        *
        * @param name The name of the event to send, cooincides with the name used in the
        * app.on() method.
        * @param ...args Any number of arguments to send to all the listeners.
        */
        dispatchEvent(name: string, ...args: any[]): any;
        /**
        * Registers a listener for a beforeNavigate event. The listener will be called when a beforeNavigate
        * event is propagating over the app. Any number of listeners can exist for a single event name.
        * This event is cancelable using the ev.cancel() method, and thereby preventing the navigation.
        *
        * @param name='beforeNavigate' The name of the event, cooinciding with the beforeNavigate event.
        * @param listener The method called when the beforeNavigate event is fired.
        * @return {IRemoveListener} A method for removing the listener.
        */
        on(name: 'beforeNavigate', listener: (ev: events.INavigationEvent<any, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
        * Registers a listener for a navigating event. The listener will be called when a navigating
        * event is propagating over the app. Any number of listeners can exist for a single event name.
        * This event is cancelable using the ev.cancel() method, and thereby preventing the navigation.
        *
        * @param name='navigating' The name of the event, cooinciding with the navigating event.
        * @param listener The method called when the navigating event is fired.
        * @return {IRemoveListener} A method for removing the listener.
        */
        on(name: 'navigating', listener: (ev: events.INavigationEvent<any, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
        * Registers a listener for a navigated event. The listener will be called when a navigated
        * event is propagating over the app. Any number of listeners can exist for a single event name.
        * This event is not cancelable.
        *
        * @param name='navigated' The name of the event, cooinciding with the navigated event.
        * @param listener The method called when the navigated event is fired.
        * @return {IRemoveListener} A method for removing the listener.
        */
        on(name: 'navigated', listener: (ev: events.INavigationEvent<ui.IViewControl, any, navigation.IBaseNavigator>) => void): IRemoveListener;
        /**
        * Registers a listener for a routeChange event. The listener will be called when a routeChange event
        * is propagating over the app. Any number of listeners can exist for a single event name.
        *
        * @param eventName='routeChange' This specifies that the listener is for a routeChange event.
        * @param listener The method called when the routeChange is fired. The route argument will contain
        * a parsed route.
        * @return {IRemoveListener} A method for removing the listener.
        */
        on(name: 'routeChange', listener: (ev: events.INavigationEvent<any, any, web.IRouter>) => void): IRemoveListener;
        /**
        * Registers a listener for a NavigationEvent. The listener will be called when a NavigationEvent is
        * propagating over the app. Any number of listeners can exist for a single event name.
        *
        * @param name The name of the event, cooinciding with the NavigationEvent name.
        * @param listener The method called when the NavigationEvent is fired.
        * @return {IRemoveListener} A method for removing the listener.
        */
        on(name: string, listener: (ev: events.INavigationEvent<any, any, any>) => void): IRemoveListener;
        /**
        * Registers a listener for a DispatchEvent. The listener will be called when a DispatchEvent is
        * propagating over the app. Any number of listeners can exist for a single event name.
        *
        * @param name The name of the event, cooinciding with the DispatchEvent name.
        * @param listener The method called when the DispatchEvent is fired.
        * @return {IRemoveListener} A method for removing the listener.
        */
        on(name: string, listener: (ev: events.IDispatchEvent, ...args: any[]) => void): IRemoveListener;
        /**
        * Kicks off compilation of the DOM from the specified node. If no node is specified,
        * the default start node is document.body. This method should be called from the app when
        * using module loaders. If a module loader is in use, the app will delay loading until
        * this method is called.
        *
        * @param node The node where at which DOM compilation begins.
        */
        load(node?: Node): any;
    }
    /**
    * Interface for an object where every key has the same typed value.
    */
    interface IObject<T> {
        [key: string]: T;
    }
    /**
    * Defines a function that will halt further callbacks to a listener.
    * Equivalent to () => void.
    */
    interface IRemoveListener {
        (): void;
    }
}
