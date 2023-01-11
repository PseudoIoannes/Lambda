
interface Array<T> {
    /**
     * 
     * @param fun function which must take an element of an Array and return boolean value
     * 
     * @returns true if all elements match the given predicate.
     * 
     * Note that if the sequence contains no elements, 
     * the function returns true because there are no elements in it
     * that do not match the predicate.
     * 
     */
        all:(fun:(element:T)=>boolean)=>boolean
        };

Array.prototype.all = function(fn){
    for (let e of this){
        if (!fn(e)) return false
    }
    return true 
}


interface Array<T> {
    /**
     * 
     * @param fun optional function which must take an element of an Array and return boolean value
     * 
     * @returns true if sequence has at least one element and no function was given or
     * returns true if at least one element matches the given predicate.
     */
    any:(fun?:(element:T)=>boolean)=>boolean
    };

Array.prototype.any = function(fn){
if (!fn) return Boolean(this.length)
for (let e of this){
    if (fn(e)) return true
}
return false 
}


interface Array<T> {
    /**
     * 
     * @param fun function which must take an element of an Array and return boolean value
     * @returns an Array containing only elements matching the given function.
     */
    filterNonNative:(fun:(element:T)=>boolean)=>Array<T>
    };

Array.prototype.filterNonNative = function(fn){
    const seq :any[]  = []//??? 
    // const seq: typeof this = []
for (let e of this){
    if (fn(e)){
        seq.push(e)
    }   
}
return seq
}


interface Array<T> {
    /**
     * 
     * @param fun function which must take an element of an Array and return boolean value
     * @returns an Array containing only elements not matching the given function.
     */
    filterNot:(fun:(element:T)=>boolean)=>Array<T>
    };

Array.prototype.filterNot = function(fn){
    const seq :any[]  = []//??? 
    // const seq: typeof this = []
for (let e of this){
    if (!fn(e)){
        seq.push(e)
    }   
}
return seq
}



interface Array<T> {
    /**
     * 
     * @param fun function which must take index and element of an Array and return boolean value
     * @returns an Array containing only elements matching the given function.
     */
    filterIndexed:(fun:(index:number, element:T)=>boolean)=>Array<T>
    };

Array.prototype.filterIndexed = function(fn){
    const seq :any[]  = []//??? 
    // const seq: typeof this = []
for (let i = 0; i <= this.length-1; i++){
    let e = this[i]
    if (fn(i,e)){
        seq.push(e)
    }   
}
return seq
}

interface Array<T> {
    /**
     * 
     * @param fun function which must take an element of an Array and return boolean value
     * @returns the first element matching the given predicate, or null if no such element was found.
     */
    findNonNative:(fun:(element:T)=>boolean)=>T|null
    };

Array.prototype.findNonNative = function(fn){

for (let e of this){
    if (fn(e)){
        return e
    }   
}
return null
}

interface Array<T> {
    /**
     * 
     * @param fun function which must take an element of an Array and return boolean value
     * @returns the last element matching the given predicate, or null if no such element was found.
     */
    findLast:(fun:(element:T)=>boolean)=>T|null
    };

Array.prototype.findLast = function(fn){
for (let index = this.length - 1; index >= 0; index--){
    let e = this[index]
    if (fn(e)){
        return e
    }   
}
return null
}


interface Array<T> {
    /**
     * 
     * @returns  an average value of elements in the Array
     */
    average:()=>number
}

Array.prototype.average = function(){
    if (this.length === 0 ) return 0
    let sum = 0
    for (let e of this){
        sum += e
    }
    console.log(sum)
    return sum / this.length
}


interface Array<T>{
    /**
     * 
     * @param keySelector functions which applied to an element returns key
     * @param valueTransform optional function which transforms element's value
     * @returns a Map containing the elements from 
     * the given sequence or applied value transformation indexed by the key returned from 
     * keySelector function applied to each element.
     */
    associateBy: <K, V>(keySelector:(element:T)=>K, valueTransform?: (element:T)=>V)=> typeof valueTransform extends Function ? Map<K, V>:Map<K, T>
}

Array.prototype.associateBy = function(keySelector,valueTransform){
    const map = new Map();
    for (let e of this){
        let key = keySelector(e)
        if (valueTransform){
            e = valueTransform(e)
        }
        map.set(key,e)
    }

    return map
}


interface Array<T>{
    /**
     * 
     * @param keySelector functions which applied to an element returns key
     * @param valueTransform optional function which transforms element's value
     * @returns Groups original values or returned by the valueTransform function 
     * applied to each element of the original sequence by the key
     *  returned by the given keySelector function applied to the
     *  element and returns a map where each group key is associated
     *  with a list of corresponding values.
     */
 
    groupBy: <K, V>(keySelector:(element:T)=>K, valueTransform?: (element:T)=>V)=> typeof valueTransform extends Function ? Map<K, Array<V>>:Map<K, Array<T>>
}

Array.prototype.groupBy = function(keySelector,valueTransform){
    const map = new Map();
    for (let e of this){
        let key = keySelector(e)
        if (valueTransform){
            e = valueTransform(e)
        }
        if (!map.has(key)) map.set(key,[e])
        else map.set(key,[...map.get(key),e] )
}

    return map
}



interface Array<T> {
    /**
     * 
     * @param fn function which must take an element and return boolean value
     * @param selector object key to count its value
     * @returns if no function and selector given: Returns the number of elements in this array
     * if both function and selector given: returns sum of selectors in elements that satisfy given function
     * if only function given: returns  the number of elements matching the given function
     * if only selector given: returns sum of selectors in all elements
     */
    count: (fn?: (element:T)=>boolean, selector?: keyof this[0])=>number
}

Array.prototype.count = function(fn,selector){//if selector is not a number?
    let total = 0
 if (!fn && !selector) return this.length
 if (fn && selector){
 for (let e of this){
    if (fn(e)) total+= e[selector]
 }
 return total
}

if (fn && !selector){
    for (let e of this){
        if (fn(e)) total+= 1
     }
     return total

}
if (!fn && selector){
    for (let e of this){
        total+=e[selector]
     }
   return total 

}

}



interface Array<T> {
    /**
     * 
     * @param fn function which takes element of an array and returns computed value
     * @returns Returns the first element yielding the smallest value of the given function.
     * or null if array is empty
     */
    minByOrNull: (fn:(element:T)=>number)=>T|null
}

Array.prototype.minByOrNull= function(fn){
    let answer!: 
    {value:number,
    element:any}
    let value: number
    for (let e of this){
       value = fn(e)
       answer = !answer || answer.value > value ? {value, element:e}: answer

    }
    return this.length? answer.element : null
}



interface Array<T> {
    /**
     * 
     * @param fn function which takes element of an array and returns computed value
     * @returns Returns the first element yielding the largest value of the given function
     * or null if array is empty
     */
    maxByOrNull: (fn:(element:T)=>number)=>T|null
}

Array.prototype.maxByOrNull= function(fn){
    let answer!: {value:number,
    element:any}
    let value: number
    for (let e of this){
       value = fn(e)
       answer = !answer || answer.value < value ? {value, element:e}: answer

    }
    return this.length? answer.element : null
}



interface Array<T> {
/**
 * 
 * @returns Returns a sequence of all elements from all sequences in this sequence.
 */
    flatten: () => Array<T>
}

Array.prototype.flatten = function(){
   const seq:any = []
   for (let e of this){
    if (Array.isArray(e)){
        seq.push(...e.flatten())
    } else {
        seq.push(e)
    }
   }

return seq
}


interface Array<T>{
    /**
     * 
     * @param size the number of elements to take in each list, must be positive and can be greater than the number of elements in this sequence.
     * @param transform function applied on each chunk 
     * @returns Splits this sequence into a sequence of lists each not exceeding the given size and applies the given transform function to an each if given
     */
    chunked : <V>(size:number, transform?:(element:Array<T>)=>V)=>typeof transform extends Function? Array<V>:Array<Array<T>>
}

Array.prototype.chunked = function(size,transform){
    if (size <= 0) throw new Error("size must be positive number")
    let answer:any[] = []
    let chunk: any[] =[]
    let counter = 0 
    for (let e of this){
        if(size != counter) chunk.push(e)
        else {
            answer.push(chunk)
            chunk = []
            counter = 0
            chunk.push(e)
        }
        counter++
    }
    if (chunk.length !== 0) answer.push(chunk)

    const transformedAnswer: any[] = []
    if (transform){
        for (let e of answer){
            transformedAnswer.push(transform(e))
        }
    }
    return transform? transformedAnswer: answer
}
 



interface Array<T>{
    /**
     * 
     * @param selector function which takes an element of array and returns property key 
     * @returns a sequence containing only elements from the given sequence having distinct keys returned by the given selector function.
     * Among elements of the given sequence with equal keys, only the first one will be present in the resulting sequence.
     *  The elements in the resulting sequence are in the same order as they were in the source sequence.
     */
    distinctBy:(selector:(element:T)=>PropertyKey)=>Array<T>

}

Array.prototype.distinctBy = function(selector){
    let values = {}
    for (let e of this){
        let key = selector(e)
        if ( values.hasOwnProperty(key)) continue
        else {
            values[key] = e
        }
    }
    console.log(values)

return Object.values(values) // not numbers???
}


interface Array<T>{
    /**
     * Accumulates value starting with initial value and applying operation from left to right to current accumulator value and each element.
     * 
     * @param initial initial value
     * @param operation function that takes current accumulator value and an element, and calculates the next accumulator value.
     * @returns Accumulated value
     */
    fold:<R>(initial:R, operation: (accumulator:R,element:T)=>R)=>R
}

Array.prototype.fold = function(initial,operation){
    let acc = initial
    for (let e of this){
        acc = operation(acc,e)
    }
 return acc
}




