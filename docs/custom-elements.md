# planager-root

## Properties

| Property         | Type                        | Default                    |
|------------------|-----------------------------|----------------------------|
| `canvasRef`      | `Ref<Element>`              | "createRef()"              |
| `currentOffset`  | `{ x: number; y: number; }` | {"x":100,"y":100}          |
| `modules`        | `never[]`                   | []                         |
| `planController` | `PlanController`            | "new PlanController(this)" |
| `socket`         |                             |                            |
| `theme`          | `string`                    | "dracula"                  |

## Methods

| Method            | Type                           |
|-------------------|--------------------------------|
| `handleKeyDown`   | `(event: any): void`           |
| `handleNewModule` | `(module: any): Promise<void>` |
| `increaseOffset`  | `(): void`                     |


# planager-dropdown


# plan-viewer

## Properties

| Property | Type     | Default |
|----------|----------|---------|
| `plan`   | `object` | {}      |


# planager-library

## Properties

| Property  | Type     | Default |
|-----------|----------|---------|
| `modules` | `object` | {}      |

## Methods

| Method              | Type                  |
|---------------------|-----------------------|
| `handleModuleClick` | `(module: any): void` |


# planager-settings


# planager-draggable-header


# planager-module

## Properties

| Property | Type     | Default |
|----------|----------|---------|
| `info`   | `object` | {}      |

## Methods

| Method     | Type             |
|------------|------------------|
| `cancel`   | `(e: any): void` |
| `wasMoved` | `(e: any): void` |


# planager-pane

## Properties

| Property      | Type     | Default   |
|---------------|----------|-----------|
| `displayName` | `string` | "unnamed" |
| `dx`          | `number` | 500       |
| `dy`          | `number` | 500       |

## Methods

| Method   | Type             |
|----------|------------------|
| `cancel` | `(e: any): void` |


# planager-pipe

## Properties

| Property        | Type     | Default |
|-----------------|----------|---------|
| `dx`            | `number` | 0       |
| `dy`            | `number` | 0       |
| `endparentid`   | `string` | ""      |
| `endportid`     | `string` | ""      |
| `scaleFactor`   | `number` | 1       |
| `startparentid` | `string` | ""      |
| `startportid`   | `string` | ""      |

## Methods

| Method            | Type         |
|-------------------|--------------|
| `calculateBezier` | `(): string` |


# planager-port

## Properties

| Property | Type     | Default |
|----------|----------|---------|
| `info`   | `object` | {}      |

## Methods

| Method                | Type             |
|-----------------------|------------------|
| `handlePortClick`     | `(e: any): void` |
| `pipeAttachmentPoint` | `(): void`       |

## Events

| Event        | Type                                         |
|--------------|----------------------------------------------|
| `port-click` | `CustomEvent<{ mouseX: any; mouseY: any; }>` |


# state-pane

## Properties

| Property       | Type      | Default |
|----------------|-----------|---------|
| `expanded`     | `boolean` | false   |
| `numPrecision` | `number`  | 3       |

## Methods

| Method            | Type                                    |
|-------------------|-----------------------------------------|
| `renderArray`     | `(val: any): any`                       |
| `renderBoolean`   | `(val: any): TemplateResult<1>`         |
| `renderNull`      | `(): TemplateResult<1>`                 |
| `renderNumber`    | `(val: any): TemplateResult<1>`         |
| `renderObject`    | `(val: any): any`                       |
| `renderPreview`   | `(numChildren: any): TemplateResult<1>` |
| `renderPrimitive` | `(node: any, path: any): void`          |
| `renderState`     | `(): TemplateResult<1>[]`               |
| `renderString`    | `(val: any): TemplateResult<1>`         |
| `renderUndefined` | `(val: any): TemplateResult<1>`         |
| `renderValue`     | `(value: any): any`                     |
| `toggleCollapse`  | `(): void`                              |


# planager-background


# planager-context-menu


# planager-toolbar

## Properties

| Property         | Type             | Default                    |
|------------------|------------------|----------------------------|
| `planController` | `PlanController` | "new PlanController(this)" |


# planager-toolbar-button


# planager-workspace

## Properties

| Property         | Type             | Default                    |
|------------------|------------------|----------------------------|
| `dragType`       | `string`         | "none"                     |
| `pipeController` | `PipeController` | "new PipeController(this)" |
| `pointerMap`     | `Map<any, any>`  | "new Map()"                |
| `scaleFactor`    | `number`         | 1                          |
| `viewOffset`     | `object`         | {"x":0,"y":0}              |

## Methods

| Method            | Type                                         |
|-------------------|----------------------------------------------|
| `draggableSlot`   | `(e: any): void`                             |
| `floatingSlot`    | `(e: any): void`                             |
| `handleDown`      | `(event: any, type: any): void`              |
| `handleMove`      | `(event: any, type: any, onMove: any): void` |
| `handleUp`        | `(event: any): void`                         |
| `moveBackground`  | `(delta: any): void`                         |
| `moveElement`     | `(child: any, delta: any): void`             |
| `undraggableSlot` | `(e: any): void`                             |
