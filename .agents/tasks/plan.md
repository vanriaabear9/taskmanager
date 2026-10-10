# Implementation Plan: Green-Themed Task Management Mobile App

## Overview
Build a complete green-themed task management app with welcome screen, tab navigation, task CRUD operations, categories (Personal/School), priorities, deadlines, and weekly completion tracking.

## Project Context
- **Expo SDK**: 57.0 with React Native 0.86.3
- **Routing**: Expo Router with file-based routing in `src/app/`
- **Theme system**: Existing Colors object in `src/constants/theme.ts`, ThemedView/ThemedText components
- **Missing dependencies**: AsyncStorage (must install), expo-linear-gradient (not available - use plain View)
- **Commands**: `npx expo install <pkg>`, `npx tsc --noEmit`, `npx expo lint`, `npx expo start`

## Implementation Steps

- [ ] 1. Install required dependencies and add green theme constants
      Install @react-native-async-storage/async-storage using `npx expo install`. Add GreenTheme export to src/constants/theme.ts with primary (#4CAF50), dark (#2E7D32), medium (#388E3C), light (#81C784), pale (#E8F5E9), accent (#1B5E20), text (#FFFFFF), gradientStart (#2E7D32), gradientEnd (#81C784).
      Files: package.json (modified by install), src/constants/theme.ts
      Verify: `npx tsc --noEmit` compiles without errors, GreenTheme can be imported

- [ ] 2. Create Task type definition
      Create src/types/task.ts with Task interface containing: id (string), title (string), category ('personal' | 'school'), deadline (string ISO format), isPriority (boolean), isCompleted (boolean), completedAt (optional string ISO), createdAt (string ISO), weekKey (optional string 'YYYY-WW' format for weekly reset tracking).
      Files: src/types/task.ts
      Verify: `npx tsc --noEmit` compiles, can import Task type

- [ ] 3. Create storage utilities for AsyncStorage
      Create src/utils/storage.ts with loadTasks() async function returning Task[] and saveTasks(tasks: Task[]) async function. Use AsyncStorage with key 'TASKS_DATA'. Handle JSON serialization and empty state (return empty array if no data).
      Files: src/utils/storage.ts
      Verify: `npx tsc --noEmit` compiles, functions have correct signatures

- [ ] 4. Create date helper utilities
      Create src/utils/date-helpers.ts with getCurrentWeekKey() returning string in 'YYYY-WW' format using ISO week calculation, and isCurrentWeek(weekKey: string | undefined) returning boolean comparing against current week.
      Files: src/utils/date-helpers.ts
      Verify: `npx tsc --noEmit` compiles, can import and call functions

- [ ] 5. Create useTasks hook with CRUD operations and weekly tracking
      Create src/hooks/use-tasks.ts with useState<Task[]> initialized empty, useEffect loading from storage on mount, useEffect saving to storage when tasks change. Functions: addTask(task without id/timestamps - generate those), updateTask(id, partial Task), deleteTask(id), toggleComplete(id - sets isCompleted, completedAt, weekKey). Computed values: totalCount, completedThisWeek (filter tasks where isCompleted && isCurrentWeek(weekKey)), pendingCount. Return { tasks, totalCount, completedThisWeek, pendingCount, addTask, updateTask, deleteTask, toggleComplete }.
      Files: src/hooks/use-tasks.ts
      Verify: `npx tsc --noEmit` compiles, hook returns correct shape

- [ ] 6. Create Welcome screen
      Replace src/app/index.tsx entirely. Use Image from expo-image to display tasklogo from assets/images/tasklogo.png. If image doesn't exist, use fallback View with green backgroundColor (GreenTheme.primary), width 200, height 200, borderRadius 100. Below image: title "Manage your daily tasks" (large, bold), subtitle "Personal Task Management App", Pressable button "Get Started" with GreenTheme.primary background calling router.push('/(tabs)/home'). Full screen centered layout with green theming.
      Files: src/app/index.tsx
      Verify: `npx tsc --noEmit` compiles, `npx expo start` shows welcome screen with all elements

- [ ] 7. Create tab navigation structure
      Create src/app/(tabs)/_layout.tsx using NativeTabs from 'expo-router/unstable-native-tabs' with 4 tabs: home (🏠), tasks (📋), calendar (📅), settings (⚙️). Use emoji for icons since custom tab icon assets unavailable. Apply GreenTheme colors to backgroundColor and indicatorColor. Create placeholder screens: src/app/(tabs)/calendar.tsx and src/app/(tabs)/settings.tsx both showing ThemedView with ThemedText "Coming Soon".
      Files: src/app/(tabs)/_layout.tsx, src/app/(tabs)/calendar.tsx, src/app/(tabs)/settings.tsx
      Verify: `npx tsc --noEmit` compiles, welcome button navigates to tabs, 4 tabs visible

- [ ] 8. Update root layout to remove AppTabs
      Modify src/app/_layout.tsx to remove AppTabs component import and usage (keep ThemeProvider and AnimatedSplashOverlay). Tabs now live in (tabs) group, not root layout. This allows welcome screen at index.tsx to show first, then navigation to (tabs) group.
      Files: src/app/_layout.tsx
      Verify: `npx expo start` shows welcome at launch, navigation works

- [ ] 9. Create WeekDateSelector component
      Create src/components/week-date-selector.tsx with horizontal ScrollView showing current week dates. Calculate 7 days starting from Monday of current week. Display as "Mon 20", "Tue 21", etc. Each date is Pressable with highlight for selected. Use GreenTheme.primary for selected background, GreenTheme.light for text. Accept onDateSelect callback prop.
      Files: src/components/week-date-selector.tsx
      Verify: `npx tsc --noEmit` compiles, component renders dates

- [ ] 10. Create TaskItem component
       Create src/components/task-item.tsx accepting props: task (Task), onToggle (() => void), onEdit (() => void), onDelete (() => void). Display in row: checkbox Pressable calling onToggle, title Text, category badge View with "Personal" or "School" text (green background for completed, light green for pending), deadline Text formatted, edit Pressable (pencil emoji ✏️), delete Pressable (trash emoji 🗑️). Use ThemedView as container, GreenTheme colors.
       Files: src/components/task-item.tsx
       Verify: `npx tsc --noEmit` compiles, component accepts all props

- [ ] 11. Create AddTaskModal component
       Create src/components/add-task-modal.tsx accepting props: visible (boolean), onClose (() => void), onSubmit ((task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'weekKey'>) => void), initialTask (optional Task for editing). Modal with TextInput for title, two Pressable buttons for category selection (Personal/School - highlight selected with green), TextInput for deadline with placeholder "YYYY-MM-DD", Switch for isPriority, Submit Pressable calling onSubmit then onClose, Cancel Pressable calling onClose. Green theme styling.
       Files: src/components/add-task-modal.tsx
       Verify: `npx tsc --noEmit` compiles, modal renders with all inputs

- [ ] 12. Build Home screen
       Create src/app/(tabs)/home.tsx. Structure: green gradient header View (use backgroundColor GreenTheme.gradientStart since expo-linear-gradient unavailable), greeting text "Good day, Van! One small task at a time is still progress", WeekDateSelector component. Below header: white background with 3 stat cards (View components) displaying totalCount, completedThisWeek, pendingCount from useTasks. FlatList of tasks using TaskItem component. Floating Pressable add button (green circle, + symbol, absolute position bottom-right, bottom: BottomTabInset + 20). useState for modalVisible and editingTask. Integrate useTasks hook for all data and operations.
       Files: src/app/(tabs)/home.tsx
       Verify: `npx tsc --noEmit` compiles, `npx expo start` shows Home screen with all sections, add/edit/delete/toggle work, stats update correctly

- [ ] 13. Build Tasks screen with search and filters
       Create src/app/(tabs)/tasks.tsx. Structure: TextInput search bar at top (green border), 3 Pressable filter buttons (All, Pending, Completed) with active state (green background). FlatList using TaskItem. useState for searchQuery and activeFilter ('all' | 'pending' | 'completed'). useMemo for filteredTasks: filter by searchQuery (case-insensitive title match) AND activeFilter (all shows all, pending shows !isCompleted, completed shows isCompleted). Reuse AddTaskModal with floating + button. Integrate useTasks hook.
       Files: src/app/(tabs)/tasks.tsx
       Verify: `npx tsc --noEmit` compiles, `npx expo start` shows Tasks screen, search filters correctly, each filter button shows correct tasks, CRUD operations work

- [ ] 14. Final verification and cleanup
       Run full typecheck with `npx tsc --noEmit`. Run linter with `npx expo lint`. Start dev server `npx expo start` and test complete flow: welcome screen → get started → home tab (view tasks, stats, add task, toggle completion, edit task, delete task) → tasks tab (search, filter All/Pending/Completed) → calendar/settings tabs show "Coming Soon". Verify weekly completion count resets for new week. Check that all colors use GreenTheme palette.
       Files: All files created in previous steps
       Verify: No TypeScript errors, no lint errors, all features work end-to-end on iOS/Android/web

## Key Technical Decisions

1. **Navigation architecture**: Use Expo Router's (tabs) group pattern. Welcome screen at src/app/index.tsx shows first (outside tabs). Tab layout at src/app/(tabs)/_layout.tsx contains 4 tabs.

2. **Gradient header**: expo-linear-gradient not installed. Use plain View with backgroundColor set to GreenTheme.gradientStart for green header (acceptable compromise).

3. **Date picker**: Avoid @react-native-community/datetimepicker (requires dev build). Use TextInput with "YYYY-MM-DD" format and manual entry.

4. **Tab icons**: Custom PNG icons unavailable for calendar/settings. Use emoji icons (🏠 📋 📅 ⚙️) via text.

5. **Weekly reset**: Implemented as computed filter, not destructive. completedThisWeek counts tasks where isCompleted && weekKey matches current ISO week. Data persists across weeks.

6. **Task logo**: Reference assets/images/tasklogo.png but provide green circular View fallback if missing (user will provide later).

7. **Storage**: Use AsyncStorage with single key 'TASKS_DATA' storing JSON array of tasks. Load on mount, save on every change.

## Notes
- Keep existing src/components/app-tabs.tsx unchanged (may be removed later by user)
- Keep existing src/app/explore.tsx (will become orphaned but harmless)
- ThemedView/ThemedText components work with existing theme system - use those for consistency
- All new components should use GreenTheme for green colors, existing theme hooks for light/dark mode support
