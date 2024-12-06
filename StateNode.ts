import { Optional } from "./types"

export interface StateNodeConfig<Meta> {
    id?: Optional<string>;
    meta?: Optional<Meta>;
    description?: Optional<string>;
}

export class StateNode<Meta> {
    public meta?: Optional<Meta>;

    public description?: Optional<string>;

    public constructor(
        public config: StateNodeConfig<Meta>
    ) {
        this.meta = this.config.meta;

        this.description = this.config.description;
    }
}