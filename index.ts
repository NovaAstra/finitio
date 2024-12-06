export type Optional<T> = T | undefined;

export type SingleOrArray<T> = readonly T[] | T;

export type TransitionTarget = SingleOrArray<string>

export type AnyTransitionConfig = TransitionConfig;

export type AnyTransitionDefinition = TransitionDefinition;

export type AnyStateNode = StateNode;

export type AnyStateNodeDefinition = StateNodeDefinition;

export interface TransitionConfig {
    target: Optional<TransitionTarget>;
    description?: string;
}

export interface TransitionDefinition extends TransitionConfig {

}

export interface StateNodeDefinition {
    version?: string;
    description?: string;
    transitions?: Array<TransitionDefinition>
}

export interface StateNodeConfig {

}

export class StateNode {
    public constructor(
        public config: StateNodeConfig
    ) { }

    public get definition(): StateNodeDefinition {
        return {}
    }

    public toJSON(): StateNodeDefinition {
        return this.definition;
    }
}