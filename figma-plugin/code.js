// Android Developer Roadmap 2026 — Figma plugin generator
//
// HOW TO RUN
//   1. Open Figma desktop app and open `figma/Android Developer Roadmap 2022.fig`
//      (or any blank Figma Design file).
//   2. Menu: Plugins → Development → Import plugin from manifest…
//   3. Select `figma-plugin/manifest.json` from this repo.
//   4. Menu: Plugins → Development → Android Roadmap 2026 Generator
//   5. The plugin builds a frame named "Android Developer Roadmap 2026" on the
//      current page using auto-layout, then closes. Drag/resize/restyle freely.
//
// EDITING
//   The full topic structure lives in the ROADMAP constant below. Edit it
//   in place and re-run to regenerate. Layout is recomputed each run.
//
// LAYOUT
//   Every section is a centered pink "section header" pill, followed by a
//   wrapping horizontal row of group "cards". Each card has a purple group
//   label on top and a vertical stack of light-purple node pills underneath.
//   This is intentionally generic — the original 2022 river layout is
//   manual work; this plugin gives you the data correctly placed so you
//   can re-style without retyping every label.

const ROADMAP = [
  {
    title: "Application Fundamentals",
    groups: [
      { label: "Android Package", children: ["APK", "AAB"] },
      { label: "Languages", children: ["Kotlin", "K2 Compiler", "Java (legacy)", "C++ (JNI)"] },
    ],
  },
  {
    title: "Android Operating System",
    groups: [
      { label: "Foundations", children: ["Multi-User Linux", "File Permissions", "Resource Isolations", "Process Management", "Sandboxing & SELinux", "Scoped Storage"] },
    ],
  },
  {
    title: "Android Platform Architecture",
    groups: [
      { label: "Layers", children: ["The Linux Kernel", "Hardware Abstraction Layer", "Android Runtime (ART)", "Native Libraries", "Java API Framework", "System Apps", "AICore"] },
    ],
  },
  {
    title: "App Manifest",
    groups: [
      { label: "Core", children: ["Package", "Application ID", "Permissions Declaration", "Foreground Service Types", "Queries / Package Visibility"] },
    ],
  },
  {
    title: "App Components",
    groups: [
      { label: "Components", children: ["Activity", "Service", "Broadcast Receiver", "Content Provider"] },
      { label: "Intent", children: ["Intent Filters", "Explicit Intents", "Implicit Intents", "PendingIntent (mutability)"] },
    ],
  },
  {
    title: "App Entry Points",
    groups: [
      { label: "Activities", children: ["Activity Lifecycles", "Activity State Changes", "Task and Back Stack", "Parcelables and Bundles"] },
      { label: "Modern Entry APIs", children: ["App Shortcuts", "Splash Screen API", "Activity Result API", "Predictive Back Gesture"] },
    ],
  },
  {
    title: "App Navigation",
    groups: [
      { label: "Navigation Component", children: ["Navigation Graph", "Type-safe Routes", "Navigation 3", "Navigation Compose", "Destinations", "DeepLink"] },
      { label: "Fragments (legacy)", children: ["Fragment Lifecycles", "Fragment State Changes", "Fragment Manager", "Fragment Transactions", "DialogFragment", "BottomSheetDialogFragment"] },
      { label: "App Links", children: ["TabLayout", "ViewPager2 (legacy)", "Custom Back Navigation", "App Links verification", "Digital Asset Links"] },
    ],
  },
  {
    title: "App Startup & Performance",
    groups: [
      { label: "Startup", children: ["Jetpack App Startup", "Cold / Warm / Hot Start"] },
      { label: "Performance", children: ["Baseline Profiles", "Macrobenchmark", "Startup Tracing (Perfetto)"] },
    ],
  },
  {
    title: "Architecture Components",
    groups: [
      { label: "UI Layer", children: ["ViewBinding", "DataBinding (legacy)", "Lifecycle", "ViewModel", "LiveData (legacy)", "Paging 3", "SavedStateHandle", "repeatOnLifecycle"] },
      { label: "Data Layer", children: ["DataStore", "WorkManager", "Repository Pattern", "Domain / UseCase"] },
    ],
  },
  {
    title: "Design Patterns",
    groups: [
      { label: "Creational", children: ["Builder Pattern", "Factory Pattern"] },
      { label: "Observer Pattern", children: ["Flow", "StateFlow / SharedFlow", "Channels", "RxJava (legacy)", "LiveData (legacy)"] },
      { label: "Dependency Injection", children: ["Hilt", "Dagger (legacy)", "Koin", "kotlin-inject", "Metro"] },
    ],
  },
  {
    title: "Architecture",
    groups: [
      { label: "Patterns", children: ["MVVM", "MVI", "Clean Architecture", "Unidirectional Data Flow (UDF)"] },
      { label: "Modern App Architecture", children: ["UI Layer", "Domain Layer", "Data Layer", "State Holders / UiState"] },
    ],
  },
  {
    title: "Modularization & Build Logic",
    groups: [
      { label: "Build", children: ["Gradle Kotlin DSL", "Version Catalogs", "Convention Plugins (build-logic)", "KSP", "Dependency Analysis Plugin"] },
      { label: "Module Structure", children: [":app", ":feature:*", ":core:*", ":data:*", ":domain:*"] },
    ],
  },
  {
    title: "Network",
    groups: [
      { label: "Clients & I/O", children: ["OkHttp", "Interceptor", "Retrofit", "Okio", "Ktor", "Ktorfit"] },
      { label: "Data Formats", children: ["kotlinx.serialization", "Moshi", "Apollo Kotlin (GraphQL)"] },
    ],
  },
  {
    title: "Image Loading",
    groups: [
      { label: "Libraries", children: ["Coil 3 (KMP)", "Glide", "coil-compose", "Landscapist"] },
    ],
  },
  {
    title: "Local Storage",
    groups: [
      { label: "Databases", children: ["Room (KMP)", "SQLite", "SQLDelight", "Realm Kotlin / Atlas Device SDK"] },
      { label: "Key-Value", children: ["DataStore", "Encrypted DataStore", "SharedPreferences (legacy)"] },
    ],
  },
  {
    title: "Asynchronous & Concurrency",
    groups: [
      { label: "Coroutines", children: ["Flow", "StateFlow", "SharedFlow", "Channels", "Structured Concurrency", "Dispatchers"] },
      { label: "Other", children: ["Thread", "WorkManager", "Expedited Jobs", "RxJava (legacy)"] },
    ],
  },
  {
    title: "User Interface (Views — Legacy)",
    groups: [
      { label: "Layouts", children: ["ConstraintLayout", "MotionLayout", "LinearLayout", "FrameLayout", "RecyclerView"] },
      { label: "Design", children: ["Material 3 / Material You", "Material 3 Expressive", "Dynamic Color (Monet)"] },
      { label: "Styles", children: ["Light Theme", "Dark Theme"] },
      { label: "Messages", children: ["Toast", "Snackbar", "Notification", "Notification Permission", "Notification Channels"] },
      { label: "Animation", children: ["ValueAnimator", "ObjectAnimator", "Lottie", "Material Motion"] },
    ],
  },
  {
    title: "Compose UI",
    groups: [
      { label: "Recomposition", children: ["Snapshot", "Strong Skipping Mode", "Compose Compiler Reports", "Stability (@Stable, @Immutable)", "Deferred reads"] },
      { label: "State", children: ["MutableState", "remember", "rememberSaveable", "derivedStateOf", "produceState", "snapshotFlow"] },
      { label: "State Hoisting", children: ["State Holder", "rememberCoroutineScope"] },
      { label: "Side-effects", children: ["LaunchedEffect", "DisposableEffect", "rememberUpdatedState"] },
      { label: "Theming (Material 3)", children: ["Color", "Typography", "Shape", "Dimens", "MotionScheme", "Custom Theme"] },
      { label: "Modifier", children: ["Modifier Order", "Chaining", "Composed modifier", "Modifier.Node API"] },
      { label: "Layout", children: ["Column", "Row", "Box", "ConstraintLayout", "FlowRow / FlowColumn", "SubcomposeLayout", "LookaheadLayout", "Custom Layout"] },
      { label: "Lists", children: ["LazyColumn", "LazyRow", "LazyVerticalGrid", "LazyHorizontalGrid", "LazyVerticalStaggeredGrid", "LazyPagingItems", "HorizontalPager", "VerticalPager"] },
      { label: "Image", children: ["Icon", "Image", "AsyncImage (Coil 3)", "coil-compose", "Landscapist"] },
      { label: "Text", children: ["Text", "TextField", "OutlinedTextField", "BasicTextField2", "ClickableText", "AnnotatedString"] },
      { label: "Graphics", children: ["Surface", "Canvas", "Brush", "GraphicsLayer", "AGSL Shaders"] },
      { label: "Animation", children: ["AnimatedVisibility", "AnimatedContent", "Crossfade", "Animatable", "animate*AsState", "InfiniteTransition", "Shared Element Transitions"] },
      { label: "Gestures", children: ["Scrolling", "Dragging", "Swiping", "Zooming", "Anchored Draggable", "Predictive Back"] },
      { label: "CompositionLocal", children: ["CompositionLocalProvider", "compositionLocalOf", "staticCompositionLocalOf"] },
      { label: "Navigation", children: ["NavHost", "composable destinations", "Type-safe routes"] },
      { label: "Components", children: ["ModalBottomSheet", "PullToRefresh", "Scaffold"] },
      { label: "Performance", children: ["Stable params", "movableContentOf", "Baseline Profiles"] },
      { label: "Testing & Preview", children: ["createComposeRule", "Semantics", "@Preview", "@PreviewParameter", "Multipreview"] },
    ],
  },
  {
    title: "Adaptive UI & Form Factors",
    groups: [
      { label: "Adaptive", children: ["WindowSizeClass", "Material 3 Adaptive", "NavigationSuiteScaffold", "ListDetailPaneScaffold", "SupportingPaneScaffold"] },
      { label: "Form Factors", children: ["Foldables (FoldingFeature)", "Large Screens / Tablet", "Compose for Wear OS", "Compose for TV", "Android XR"] },
      { label: "Insets", children: ["Edge-to-edge", "WindowInsets"] },
    ],
  },
  {
    title: "Widgets (Glance)",
    groups: [
      { label: "Glance", children: ["GlanceAppWidget", "GlanceStateDefinition", "Glance + Material 3"] },
    ],
  },
  {
    title: "Camera & Media",
    groups: [
      { label: "Camera", children: ["CameraX", "Camera2"] },
      { label: "Media", children: ["Media3 / ExoPlayer", "Photo Picker", "MediaStore (scoped)"] },
    ],
  },
  {
    title: "Background Work",
    groups: [
      { label: "Foreground", children: ["Foreground Service Types", "Expedited Work"] },
      { label: "Scheduling", children: ["AlarmManager", "Exact Alarms permission", "JobScheduler", "Doze & App Standby"] },
    ],
  },
  {
    title: "Privacy & Security",
    groups: [
      { label: "Privacy", children: ["Privacy Sandbox on Android", "Photo Picker", "Granular Media Permissions", "Notification Permission", "Scoped Storage", "App Set ID"] },
      { label: "Security", children: ["Credential Manager / Passkeys", "Biometric API", "Network Security Config", "Data Safety (Play Console)"] },
    ],
  },
  {
    title: "On-Device AI / GenAI",
    groups: [
      { label: "On-device", children: ["AICore", "Gemini Nano", "ML Kit GenAI APIs", "ML Kit (Vision/Text/Translate)", "LiteRT (TFLite)", "MediaPipe Tasks"] },
      { label: "Cloud", children: ["Firebase AI Logic", "Vertex AI in Firebase"] },
    ],
  },
  {
    title: "Kotlin Multiplatform",
    groups: [
      { label: "KMP", children: ["expect / actual", "commonMain", "androidMain", "iosMain", "Compose Multiplatform"] },
      { label: "KMP Libraries", children: ["Ktor", "SQLDelight", "kotlinx.coroutines", "kotlinx.serialization", "Koin", "Decompose", "Voyager", "Coil 3", "Room KMP"] },
      { label: "iOS Interop", children: ["cinterop", "Swift Export"] },
    ],
  },
  {
    title: "Service",
    groups: [
      { label: "Google", children: ["Google Play Services", "Google Maps", "Health Connect", "Credential Manager"] },
      { label: "Firebase", children: ["Authentication", "Crashlytics", "Remote Config", "Cloud Messaging", "FireStore", "Realtime Database", "App Check", "Performance Monitoring", "Firebase AI Logic"] },
      { label: "Advertisement", children: ["Google AdMob", "AppLovin MAX", "Unity LevelPlay"] },
    ],
  },
  {
    title: "Code Analysis & Test",
    groups: [
      { label: "Linter", children: ["Ktlint", "Detekt", "Android Lint", "Spotless"] },
      { label: "Debugging", children: ["Timber", "LeakCanary", "Chucker", "Layout Inspector", "App Inspection"] },
      { label: "Unit Test", children: ["JUnit 4 / JUnit 5", "Kluent", "MockK", "Robolectric", "Turbine", "Truth / AssertK / Kotest"] },
      { label: "Android Test", children: ["Espresso", "Kaspresso", "Compose Test Rule", "Maestro", "UI Automator"] },
      { label: "Benchmark", children: ["Microbenchmark", "Macrobenchmark"] },
      { label: "Screenshot Test", children: ["Paparazzi", "Roborazzi", "Compose Preview Screenshot Testing"] },
    ],
  },
  {
    title: "CI/CD",
    groups: [
      { label: "Pipelines", children: ["GitHub Actions", "GitLab CI", "Jenkins"] },
      { label: "Tooling", children: ["Fastlane", "Gradle Build Cache (remote)", "Gradle Enterprise / Develocity"] },
    ],
  },
  {
    title: "QA & App Publishing",
    groups: [
      { label: "Distribution", children: ["Firebase App Distribution", "Google Play Store"] },
      { label: "Play Console", children: ["Internal / Closed / Open Testing", "Play App Signing", "Play Integrity API", "In-App Updates", "In-App Reviews", "Play Asset Delivery"] },
    ],
  },
];

const STYLES = {
  bg:      { r: 0.06, g: 0.07, b: 0.13 },
  title:   { r: 0.78, g: 0.69, b: 0.99 },
  section: { fill: { r: 0.88, g: 0.48, b: 0.79 }, text: { r: 1.00, g: 1.00, b: 1.00 }, size: 18, padX: 18, padY: 8, weight: "Bold" },
  group:   { fill: { r: 0.61, g: 0.54, b: 0.79 }, text: { r: 1.00, g: 1.00, b: 1.00 }, size: 13, padX: 14, padY: 6, weight: "Medium" },
  node:    { fill: { r: 0.77, g: 0.72, b: 0.88 }, text: { r: 0.10, g: 0.10, b: 0.20 }, size: 11, padX: 10, padY: 5, weight: "Regular" },
};

const ROW_WIDTH = 1900;

async function build() {
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  ]);

  const root = figma.createFrame();
  root.name = "Android Developer Roadmap 2026";
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "AUTO";
  root.counterAxisAlignItems = "CENTER";
  root.itemSpacing = 56;
  root.paddingTop = 64;
  root.paddingBottom = 64;
  root.paddingLeft = 64;
  root.paddingRight = 64;
  root.fills = [{ type: "SOLID", color: STYLES.bg }];
  root.cornerRadius = 24;

  const title = figma.createText();
  title.fontName = { family: "Inter", style: "Bold" };
  title.characters = "Android Developer Roadmap 2026";
  title.fontSize = 44;
  title.fills = [{ type: "SOLID", color: STYLES.title }];
  root.appendChild(title);

  for (const section of ROADMAP) {
    root.appendChild(buildSection(section));
  }

  figma.currentPage.appendChild(root);
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.notify("Android Developer Roadmap 2026 generated.");
}

function buildSection(section) {
  const frame = figma.createFrame();
  frame.name = section.title;
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.counterAxisAlignItems = "CENTER";
  frame.itemSpacing = 24;
  frame.fills = [];

  frame.appendChild(makePill(section.title, STYLES.section));

  const row = figma.createFrame();
  row.name = "groups";
  row.layoutMode = "HORIZONTAL";
  row.layoutWrap = "WRAP";
  row.primaryAxisSizingMode = "FIXED";
  row.counterAxisSizingMode = "AUTO";
  row.resize(ROW_WIDTH, 100);
  row.itemSpacing = 20;
  row.counterAxisSpacing = 24;
  row.primaryAxisAlignItems = "CENTER";
  row.counterAxisAlignItems = "MIN";
  row.fills = [];

  for (const group of section.groups) {
    row.appendChild(buildGroup(group));
  }

  frame.appendChild(row);
  return frame;
}

function buildGroup(group) {
  const card = figma.createFrame();
  card.name = group.label;
  card.layoutMode = "VERTICAL";
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "AUTO";
  card.counterAxisAlignItems = "CENTER";
  card.itemSpacing = 6;
  card.fills = [];

  card.appendChild(makePill(group.label, STYLES.group));

  for (const child of group.children) {
    card.appendChild(makePill(child, STYLES.node));
  }

  return card;
}

function makePill(text, style) {
  const pill = figma.createFrame();
  pill.layoutMode = "HORIZONTAL";
  pill.primaryAxisSizingMode = "AUTO";
  pill.counterAxisSizingMode = "AUTO";
  pill.paddingLeft = style.padX;
  pill.paddingRight = style.padX;
  pill.paddingTop = style.padY;
  pill.paddingBottom = style.padY;
  pill.cornerRadius = 8;
  pill.fills = [{ type: "SOLID", color: style.fill }];

  const t = figma.createText();
  t.fontName = { family: "Inter", style: style.weight };
  t.characters = text;
  t.fontSize = style.size;
  t.fills = [{ type: "SOLID", color: style.text }];

  pill.appendChild(t);
  return pill;
}

build()
  .catch((e) => {
    figma.notify("Roadmap generator failed: " + e.message, { error: true });
    console.error(e);
  })
  .then(() => figma.closePlugin());
