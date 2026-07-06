// Build-time ambient shim for the `react-native` peer dependency.
//
// react-native is a peerDependency (resolved from the host app), so it is not
// installed here. This minimal declaration lets `tsc` compile src/index.ts
// without pulling the full React Native type tree. It is a .d.ts, so it is not
// emitted into dist and never reaches consumers — their real react-native types
// apply when they import this package.
declare module "react-native" {
  export const NativeModules: { [name: string]: any };
}
