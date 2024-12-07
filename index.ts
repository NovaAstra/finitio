export type Optional<T> = T | undefined;

export type NMTOKEN = string;

export type SingleOrArray<T> = readonly T[] | T;

export type TransitionTarget = SingleOrArray<string>

export type AnyTransitionConfig = TransitionConfig;

export type AnyTransitionDefinition = TransitionDefinition;

export type AnyStateNode = StateNode;

export type AnyStateMachine = StateMachine;

export type AnyStateNodeDefinition = StateNodeDefinition;

export type StateMachineDefinition = StateNodeDefinition

export type MachineConfig = StateMachineConfig

export type StatesConfig = Record<string, StateNodeConfig>

export type StateNodesConfig = Record<string, StateNode>

export type StatesDefinition = Record<string, StateNodeDefinition>

export interface TransitionConfig {
    target: Optional<TransitionTarget>;
    description?: string;
}

export interface TransitionDefinition extends TransitionConfig {

}

export interface StateNodeDefinition {
    version?: string;
    description?: string;
    states: StatesDefinition;
}

export interface StateNodeConfig {
    states?: StatesConfig;
}

export interface StateNodeOptions {
    machine: AnyStateMachine;
    parent?: StateNode;
}

export interface StateMachineConfig extends StateNodeConfig {
    /**
     * @description 
     * The name of this state machine. 
     * It is for purely informational purposes.
     * 
     * @typedef {string} 
     * Any valid NMTOKEN
     */
    name?: NMTOKEN;

    /**
     * @typedef {string}
     * The value MUST be "1.0"
     */
    version: string;
}

function mapValue(collection: any, iteratee: any) {
    let result: any = {}

    for (const key in collection) {
        result[key] = iteratee(collection[key], key);
    }

    return result;
}

export class StateNode {
    public machine: StateMachine

    public states?: StateNodesConfig;

    public constructor(
        public config: StateNodeConfig,
        private readonly options: StateNodeOptions
    ) {
        this.machine = this.options.machine

        this.states = this.config.states
            ? mapValue(
                this.config.states,
                (stateConfig: StateNodeConfig, key: string) => {
                    return new StateNode(stateConfig, {
                        parent: this,
                        machine: this.machine
                    })
                })
            : {}
    }

    /** 
     * @internal 
     */
    public initialize() { }

    public get definition(): StateNodeDefinition {
        return {
            states: mapValue(this.states, (state: StateNode) => state.definition)
        }
    }

    public toJSON(): StateNodeDefinition {
        return this.definition;
    }
}

export class StateMachine {
    public root: StateNode;

    public version: string;

    public constructor(
        public config: StateMachineConfig
    ) {
        this.version = this.config.version;

        this.root = new StateNode(config, {
            machine: this
        })

        this.root.initialize()
    }

    public get definition(): StateMachineDefinition {
        return this.root.definition
    }

    public toJSON(): StateMachineDefinition {
        return this.definition;
    }
}

export function createMachine(config: MachineConfig) {
    return new StateMachine(config)
}

const machine = createMachine({
    version: "0.1",
    states: {
        inactive: {
            states: {
                child: {}
            }
        },

    }
})

console.log(machine.toJSON())