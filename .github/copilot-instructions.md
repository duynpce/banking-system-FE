# convention

| Category | Convention | Examples |
|----------|-----------|---------|
| React component files | `PascalCase.tsx` | `Login.tsx`, `Register.tsx`, `CallBack.tsx` |
| Service files | `camelCase.service.ts` | `login.service.ts`, `callback.service.ts` |
| Type files | `kebab-case.type.ts` | `account.type.ts`, `unique-detail.type.ts` |
| DTO files | `camelCase.dto.ts` | `common.dto.ts` |
| Utility/constant files | `camelCase.ts` | `api.ts`, `util.ts`, `constant.ts` |
| Unit test files | `camelCase.unit.test.tsx` | `login.unit.test.tsx` |
| Integration test files | `camelCase.it.test.tsx` | `register.it.test.tsx` |
| Folder names | `lowercase` | `auth/`, `shared/`, `component/` |
| Component names | `PascalCase` | `LoginForm`, `OverView` |
| Function/variable names | `camelCase` | `handleRegister`, `navigate` |
| Constants | `UPPER_SNAKE_CASE` | `ROOT_API_URL`, `CLIENT_ID` |

# folder structure

Feature-based folder structure. Each feature follows this pattern:

    src/
    ├── <feature>/              # e.g. auth/, customer/, admin/, home/
    │   ├── <sub-feature>/      # e.g. login/, register/, dashboard/
    │   │   ├── XxxPage.tsx     # Page-level component (no props, routed)
    │   │   └── xxx.service.ts  # Service: async functions for API calls
    │   └── common/             # Shared within the feature
    ├── shared/
    │   ├── component/          # Reusable UI components (Button, Card, etc.)
    │   ├── constant/           # App-wide constants (constant.ts)
    │   └── dto/                # Generic/shared response interfaces (common.dto.ts)
    ├── types/                  # Domain-specific type definitions (*.type.ts)
    ├── utils/
    │   ├── api.ts              # Axios instance (single export: `api`)
    │   └── util.ts             # Generic utility functions
    └── App.tsx                 # Centralized route definitions

    test/                       # Mirrors src/ structure
    ├── <feature>/
    ├── mocks/
    │   └── server.ts           # MSW server (no default handlers)
    └── util/


# principle

    - Only allow to change the code that I allow
    - Strictly follow the coding conventions above
    - If you think you have a better solution, discuss with me before implementing it
    - If you need more context about the project, ask me before implementing
    - Give the documentation link where you found the solution if you are not confident
    - Never change unrelated code while implementing a feature

# shared components

| Component | Description |
|-----------|-------------|
| `BarChar` | Grouped bar chart built on Recharts. Accepts an array of bar configs (`dataKey`, `name`, `color`), a data array, and a `period` (`day`/`week`/`month`/`year`) that drives the X-axis key. |
| `Button` | Simple styled button with blue Tailwind styling. Extends all native `<button>` HTML attributes; requires a `content` prop for the label. |
| `Card` | Layout wrapper with a title heading and a rounded inner content area. Accepts `children`, `innerClassName` for the inner container, and passes remaining props to the outer `<div>`. |
| `ImgButton` | Icon button that renders an image (`src`, `alt`) instead of text. Extends all native `<button>` HTML attributes. |
| `InfoItem` | Two-line labeled data display: a small muted `title` on top and a bold `value` below. Used for account info, stats, and similar labeled fields. |
| `LineChar` | Multi-line chart built on Recharts. Same API as `BarChar` but with line configs (`dataKey`, `name`, `color`). Reuses the `Period` type from `BarChar`. |
| `PieChar` | Donut/pie chart with a built-in legend. Accepts an array of `{ name, value, color }` items. |
| `SearchBar` | Styled search form with a text input and an SVG search icon button. Extends React Router's `FormProps`, so it can act as a router-aware `<Form>`. Optional `placeHolder` prop (defaults to `"Search"`). |

# commit
    - Use Conventional Commits (feat:, fix:, chore:, refactor:)
    - Write simple, clear, and concise commit messages that describe the changes made
    - If there is a conflict, tell me before resolving it and explain why your solution is the best
