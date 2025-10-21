# Comprehensive Recovery Plan: Restore All Canvas Functionality

## Executive Summary

This plan systematically restores all broken functionality with clean, quality code following best practices. We'll fix the immediate syntax error, then methodically verify and restore each feature.

## Current State Assessment

### Broken Functionality
1. **CRITICAL**: Syntax error in `app/page.tsx` line 33 preventing app from running
2. **Drag from library**: Cannot add components to canvas
3. **Move components**: Cannot drag placed components to new positions  
4. **Remove components**: May be broken due to syntax error
5. **Iframe interaction**: Minimal hover detection implemented but untested

### Root Causes
- **Immediate**: Missing function signature in `handleDragCancel`
- **Systematic**: Incremental debugging changes without testing broke working features
- **Architectural**: Over-complex hover detection and drag handling

## Recovery Strategy

### Phase 1: Emergency Fix (Restore Basic Operation)
**Goal**: Get the app running again

1. Fix syntax error in `app/page.tsx` line 33
2. Verify app compiles and runs
3. Test basic rendering

### Phase 2: Restore Core Functionality
**Goal**: Working drag-and-drop from library

1. Verify library drag setup is correct
2. Test drag from library → canvas works
3. Confirm drop zones are active

### Phase 3: Fix Move Functionality
**Goal**: Working move for placed components

1. Simplify MoveHandle implementation
2. Ensure proper drag data structure
3. Verify controls persist during drag
4. Test move operation end-to-end

### Phase 4: Verification & Cleanup
**Goal**: All features working, code clean

1. Test remove functionality
2. Test iframe interaction
3. Remove all debug logging
4. Final comprehensive test

## Detailed Implementation Steps

### Step 1: Fix Critical Syntax Error

**File**: `app/page.tsx`, line 33

**Current (Broken)**:
```tsx
const handleDragCancel =  {
    setGlobalDragging(false);
    clearDragInfo();
  };
```

**Fixed**:
```tsx
const handleDragCancel = (_evt: DragCancelEvent) => {
    setGlobalDragging(false);
    clearDragInfo();
  };
```

### Step 2: Remove Debug onClick from MoveHandle

**File**: `components/Canvas.tsx`

**Remove**: `onClick={() => console.log('MoveHandle clicked:', id)}`

This conflicts with drag events.

### Step 3: Simplify Drag Event Handlers

**File**: `app/page.tsx`

**Simplify logging** (keep minimal for verification):

```tsx
const handleDragStart = (evt: DragStartEvent) => {
  console.log('Drag started:', evt.active.id);
  setGlobalDragging(true);
};

const handleDragEnd = (event: DragEndEvent) => {
  const overId = event.over?.id as string | undefined;
  const data = (event.active.data.current || {}) as any;
  
  if (!overId || !data) { 
    setGlobalDragging(false); 
    clearDragInfo(); 
    return; 
  }
  
  const match = /r(\d+)c(\d+)/.exec(overId);
  if (!match) { 
    setGlobalDragging(false); 
    clearDragInfo(); 
    return; 
  }
  
  let r = parseInt(match[1], 10);
  let c = parseInt(match[2], 10);
  const rows = useBuilderStore.getState().grid.rows;
  const cols = useBuilderStore.getState().grid.cols;
  
  if (data.type === "catalog") {
    const catalog = SNIPPETS.find((s) => s.id === data.catalogId);
    if (!catalog) { 
      setGlobalDragging(false); 
      clearDragInfo(); 
      return; 
    }
    if (r + catalog.span.h > rows) r = Math.max(0, rows - catalog.span.h);
    if (c + catalog.span.w > cols) c = Math.max(0, cols - catalog.span.w);
    if (canPlace(r, c, catalog.span.w, catalog.span.h)) {
      placeItem(catalog, r, c);
      console.log('✓ Placed:', catalog.id);
    }
  } else if (data.type === "item") {
    const itemId: string = data.itemId;
    const w: number = data.span.w;
    const h: number = data.span.h;
    if (r + h > rows) r = Math.max(0, rows - h);
    if (c + w > cols) c = Math.max(0, cols - w);
    if (canPlace(r, c, w, h, itemId)) {
      useBuilderStore.getState().moveItem(itemId, r, c);
      console.log('✓ Moved:', itemId, 'to', r, c);
    }
  }
  
  setGlobalDragging(false);
  clearDragInfo();
};
```

### Step 4: Update MoveHandle to Remove Debug Code

**File**: `components/Canvas.tsx`

```tsx
function MoveHandle({ id, r, c, w, h }: { id: string; r: number; c: number; w: number; h: number }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `item:${id}`,
    data: { type: "item", itemId: id, span: { w, h } },
  });
  
  return (
    <IconButton
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      aria-label="Move"
      size="xs"
      variant="outline"
      colorScheme="gray"
      className={`draggable-item ${isDragging ? "is-dragging" : ""}`}
      style={{ touchAction: "none" }}
      icon={
        <Icon viewBox="0 0 24 24" boxSize="3.5">
          <path fill="currentColor" d="M7 4h2v2H7V4m8 0h2v2h-2V4M7 18h2v2H7v-2m8 0h2v2h-2v-2M4 7h2v2H4V7m14 0h2v2h-2V7M4 15h2v2H4v-2m14 0h2v2h-2v-2"/>
        </Icon>
      }
    />
  );
}
```

### Step 5: After Testing, Remove All Console Logs

Once all features work, remove:
- All `console.log` statements from `app/page.tsx`
- `useEffect` logging from `MoveHandle` in `components/Canvas.tsx`

## Acceptance Criteria

### Must Work
1. ✅ **Drag from library** → Add component to canvas
2. ✅ **Hover top-right corner** → Controls appear
3. ✅ **Drag move icon** → Component moves to new position
4. ✅ **Click remove icon** → Component deleted
5. ✅ **Click iframe content** → Buttons/links work (except top-right 80×36px)

### Quality Standards
1. ✅ No console errors
2. ✅ No console warnings
3. ✅ Minimal logging (only success messages)
4. ✅ Clean, readable code
5. ✅ Consistent patterns throughout

## Testing Protocol

### Test Sequence
1. **App loads** → No errors in console
2. **Drag Header component from library** → Place at row 0, col 0
3. **Verify rendering** → Component appears in iframe
4. **Hover top-right corner** → Controls appear
5. **Click move icon, drag to row 1, col 0** → Component moves
6. **Click remove icon** → Component disappears
7. **Add Button component** → Place at row 0, col 0
8. **Click the button in component** → Console shows button click (iframe interaction works)
9. **Repeat for thin (1×1) and thick (4×4) components** → Consistent behavior

## Implementation Order

1. Fix syntax error in `app/page.tsx` line 33
2. Remove debug `onClick` from MoveHandle
3. Simplify drag event handlers
4. Test drag from library
5. Test move functionality
6. Test remove functionality
7. Test iframe interaction
8. Remove excess console logs
9. Final comprehensive test
10. Git commit with descriptive message
11. Git push to save working state

## Success Metrics

- All 5 acceptance criteria pass
- Zero console errors
- Zero console warnings  
- Code is clean and maintainable
- User can perform all intended actions

