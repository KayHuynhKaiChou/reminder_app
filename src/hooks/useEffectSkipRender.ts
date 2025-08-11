import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export default function useEffectSkipFirstRender(
    effectCallback : EffectCallback,
    deps : DependencyList
) {
    const firstRender = useRef<boolean>(true);

    useEffect(() => {
        if(firstRender.current){
            firstRender.current = false
        }else{
            const effectCallbackReturns = effectCallback();
            if(effectCallbackReturns && typeof effectCallbackReturns === 'function'){
                return effectCallbackReturns
            }
        }
        
        return (...args: any[]) => {args}
    },deps)
}