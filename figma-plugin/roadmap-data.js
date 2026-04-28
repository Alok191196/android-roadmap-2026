// Shared topic structure for the Android Developer Roadmap 2026.
// Used by generate-svg.js, build-assignments.js, and generate-html.js.
// Edit this single source of truth and re-run the generators.

const ROADMAP = [
  { title: "Application Fundamentals", groups: [
    { label: "Android Package", children: ["APK", "AAB"] },
    { label: "Languages", children: ["Kotlin", "K2 Compiler", "Java (legacy)", "C++ (JNI)"] },
  ] },
  { title: "Android Operating System", groups: [
    { label: "Foundations", children: ["Multi-User Linux", "File Permissions", "Resource Isolations", "Process Management", "Sandboxing & SELinux", "Scoped Storage"] },
  ] },
  { title: "Android Platform Architecture", groups: [
    { label: "Layers", children: ["The Linux Kernel", "Hardware Abstraction Layer", "Android Runtime (ART)", "Native Libraries", "Java API Framework", "System Apps", "AICore"] },
  ] },
  { title: "App Manifest", groups: [
    { label: "Core", children: ["Package", "Application ID", "Permissions Declaration", "Foreground Service Types", "Queries / Package Visibility"] },
  ] },
  { title: "App Components", groups: [
    { label: "Components", children: ["Activity", "Service", "Broadcast Receiver", "Content Provider"] },
    { label: "Intent", children: ["Intent Filters", "Explicit Intents", "Implicit Intents", "PendingIntent (mutability)"] },
  ] },
  { title: "App Entry Points", groups: [
    { label: "Activities", children: ["Activity Lifecycles", "Activity State Changes", "Task and Back Stack", "Parcelables and Bundles"] },
    { label: "Modern Entry APIs", children: ["App Shortcuts", "Splash Screen API", "Activity Result API", "Predictive Back Gesture"] },
  ] },
  { title: "App Navigation", groups: [
    { label: "Navigation Component", children: ["Navigation Graph", "Type-safe Routes", "Navigation 3", "Navigation Compose", "Destinations", "DeepLink"] },
    { label: "Fragments (legacy)", children: ["Fragment Lifecycles", "Fragment State Changes", "Fragment Manager", "Fragment Transactions", "DialogFragment", "BottomSheetDialogFragment"] },
    { label: "App Links", children: ["TabLayout", "ViewPager2 (legacy)", "Custom Back Navigation", "App Links verification", "Digital Asset Links"] },
  ] },
  { title: "App Startup & Performance", groups: [
    { label: "Startup", children: ["Jetpack App Startup", "Cold / Warm / Hot Start"] },
    { label: "Performance", children: ["Baseline Profiles", "Macrobenchmark", "Startup Tracing (Perfetto)"] },
  ] },
  { title: "Architecture Components", groups: [
    { label: "UI Layer", children: ["ViewBinding", "DataBinding (legacy)", "Lifecycle", "ViewModel", "LiveData (legacy)", "Paging 3", "SavedStateHandle", "repeatOnLifecycle"] },
    { label: "Data Layer", children: ["DataStore", "WorkManager", "Repository Pattern", "Domain / UseCase"] },
  ] },
  { title: "Design Patterns", groups: [
    { label: "Creational", children: ["Builder Pattern", "Factory Pattern"] },
    { label: "Observer Pattern", children: ["Flow", "StateFlow / SharedFlow", "Channels", "RxJava (legacy)", "LiveData (legacy)"] },
    { label: "Dependency Injection", children: ["Hilt", "Dagger (legacy)", "Koin", "kotlin-inject", "Metro"] },
  ] },
  { title: "Architecture", groups: [
    { label: "Patterns", children: ["MVVM", "MVI", "Clean Architecture", "Unidirectional Data Flow (UDF)"] },
    { label: "Modern App Architecture", children: ["UI Layer", "Domain Layer", "Data Layer", "State Holders / UiState"] },
  ] },
  { title: "Modularization & Build Logic", groups: [
    { label: "Build", children: ["Gradle Kotlin DSL", "Version Catalogs", "Convention Plugins (build-logic)", "KSP", "Dependency Analysis Plugin"] },
    { label: "Module Structure", children: [":app", ":feature:*", ":core:*", ":data:*", ":domain:*"] },
  ] },
  { title: "Network", groups: [
    { label: "Clients & I/O", children: ["OkHttp", "Interceptor", "Retrofit", "Okio", "Ktor", "Ktorfit"] },
    { label: "Data Formats", children: ["kotlinx.serialization", "Moshi", "Apollo Kotlin (GraphQL)"] },
  ] },
  { title: "Image Loading", groups: [
    { label: "Libraries", children: ["Coil 3 (KMP)", "Glide", "coil-compose", "Landscapist"] },
  ] },
  { title: "Local Storage", groups: [
    { label: "Databases", children: ["Room (KMP)", "SQLite", "SQLDelight", "Realm Kotlin / Atlas Device SDK"] },
    { label: "Key-Value", children: ["DataStore", "Encrypted DataStore", "SharedPreferences (legacy)"] },
  ] },
  { title: "Asynchronous & Concurrency", groups: [
    { label: "Coroutines", children: ["Flow", "StateFlow", "SharedFlow", "Channels", "Structured Concurrency", "Dispatchers"] },
    { label: "Other", children: ["Thread", "WorkManager", "Expedited Jobs", "RxJava (legacy)"] },
  ] },
  { title: "User Interface (Views — Legacy)", groups: [
    { label: "Layouts", children: ["ConstraintLayout", "MotionLayout", "LinearLayout", "FrameLayout", "RecyclerView"] },
    { label: "Design", children: ["Material 3 / Material You", "Material 3 Expressive", "Dynamic Color (Monet)"] },
    { label: "Styles", children: ["Light Theme", "Dark Theme"] },
    { label: "Messages", children: ["Toast", "Snackbar", "Notification", "Notification Permission", "Notification Channels"] },
    { label: "Animation", children: ["ValueAnimator", "ObjectAnimator", "Lottie", "Material Motion"] },
  ] },
  { title: "Compose UI", groups: [
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
  ] },
  { title: "Adaptive UI & Form Factors", groups: [
    { label: "Adaptive", children: ["WindowSizeClass", "Material 3 Adaptive", "NavigationSuiteScaffold", "ListDetailPaneScaffold", "SupportingPaneScaffold"] },
    { label: "Form Factors", children: ["Foldables (FoldingFeature)", "Large Screens / Tablet", "Compose for Wear OS", "Compose for TV", "Android XR"] },
    { label: "Insets", children: ["Edge-to-edge", "WindowInsets"] },
  ] },
  { title: "Widgets (Glance)", groups: [
    { label: "Glance", children: ["GlanceAppWidget", "GlanceStateDefinition", "Glance + Material 3"] },
  ] },
  { title: "Camera & Media", groups: [
    { label: "Camera", children: ["CameraX", "Camera2"] },
    { label: "Media", children: ["Media3 / ExoPlayer", "Photo Picker", "MediaStore (scoped)"] },
  ] },
  { title: "Background Work", groups: [
    { label: "Foreground", children: ["Foreground Service Types", "Expedited Work"] },
    { label: "Scheduling", children: ["AlarmManager", "Exact Alarms permission", "JobScheduler", "Doze & App Standby"] },
  ] },
  { title: "Privacy & Security", groups: [
    { label: "Privacy", children: ["Privacy Sandbox on Android", "Photo Picker", "Granular Media Permissions", "Notification Permission", "Scoped Storage", "App Set ID"] },
    { label: "Security", children: ["Credential Manager / Passkeys", "Biometric API", "Network Security Config", "Data Safety (Play Console)"] },
  ] },
  { title: "On-Device AI / GenAI", groups: [
    { label: "On-device", children: ["AICore", "Gemini Nano", "ML Kit GenAI APIs", "ML Kit (Vision/Text/Translate)", "LiteRT (TFLite)", "MediaPipe Tasks"] },
    { label: "Cloud", children: ["Firebase AI Logic", "Vertex AI in Firebase"] },
  ] },
  { title: "Kotlin Multiplatform", groups: [
    { label: "KMP", children: ["expect / actual", "commonMain", "androidMain", "iosMain", "Compose Multiplatform"] },
    { label: "KMP Libraries", children: ["Ktor", "SQLDelight", "kotlinx.coroutines", "kotlinx.serialization", "Koin", "Decompose", "Voyager", "Coil 3", "Room KMP"] },
    { label: "iOS Interop", children: ["cinterop", "Swift Export"] },
  ] },
  { title: "Service", groups: [
    { label: "Google", children: ["Google Play Services", "Google Maps", "Health Connect", "Credential Manager"] },
    { label: "Firebase", children: ["Authentication", "Crashlytics", "Remote Config", "Cloud Messaging", "FireStore", "Realtime Database", "App Check", "Performance Monitoring", "Firebase AI Logic"] },
    { label: "Advertisement", children: ["Google AdMob", "AppLovin MAX", "Unity LevelPlay"] },
  ] },
  { title: "Code Analysis & Test", groups: [
    { label: "Linter", children: ["Ktlint", "Detekt", "Android Lint", "Spotless"] },
    { label: "Debugging", children: ["Timber", "LeakCanary", "Chucker", "Layout Inspector", "App Inspection"] },
    { label: "Unit Test", children: ["JUnit 4 / JUnit 5", "Kluent", "MockK", "Robolectric", "Turbine", "Truth / AssertK / Kotest"] },
    { label: "Android Test", children: ["Espresso", "Kaspresso", "Compose Test Rule", "Maestro", "UI Automator"] },
    { label: "Benchmark", children: ["Microbenchmark", "Macrobenchmark"] },
    { label: "Screenshot Test", children: ["Paparazzi", "Roborazzi", "Compose Preview Screenshot Testing"] },
  ] },
  { title: "CI/CD", groups: [
    { label: "Pipelines", children: ["GitHub Actions", "GitLab CI", "Jenkins"] },
    { label: "Tooling", children: ["Fastlane", "Gradle Build Cache (remote)", "Gradle Enterprise / Develocity"] },
  ] },
  { title: "QA & App Publishing", groups: [
    { label: "Distribution", children: ["Firebase App Distribution", "Google Play Store"] },
    { label: "Play Console", children: ["Internal / Closed / Open Testing", "Play App Signing", "Play Integrity API", "In-App Updates", "In-App Reviews", "Play Asset Delivery"] },
  ] },
];

module.exports = { ROADMAP };
