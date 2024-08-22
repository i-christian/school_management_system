declare module "solid-js" {
  namespace JSX {
    interface ExplicitProperties {
      count: number;
      name: string;
    }
    interface ExplicitAttributes {
      count: number;
      name: string;
    }
    interface Directives {
      model: [() => any, (v: any) => any];
    }
  }
}
