# Admin Dashboard UI Structure Guide

## 📁 Folder Structure

```
src/components/admin/
├── layout/
│   └── DashboardLayout.tsx        # Main page wrapper
├── cards/
│   ├── StatCard.tsx               # KPI statistics card
│   ├── ChartCard.tsx              # Chart container
│   └── DataTableCard.tsx          # Table container
├── table/
│   ├── TableHeader.tsx            # Table header
│   └── TableRow.tsx               # Table row with actions
└── common/
    ├── ActionButtons.tsx          # Edit, View, Delete buttons
    ├── Badge.tsx                  # Status badges
    ├── EmptyState.tsx             # Empty state display
    ├── SearchBar.tsx              # Search input
    ├── FilterBar.tsx              # Filter controls
    ├── Pagination.tsx             # Pagination controls
    ├── Modal.tsx                  # Modal dialogs
    └── Alert.tsx                  # Alert notifications
```

## 🎯 Component Usage Examples

### 1. **DashboardLayout** - Page wrapper
```tsx
<DashboardLayout
  title="Dashboard"
  subtitle="Welcome back! Here's your overview."
>
  {/* Content goes here */}
</DashboardLayout>
```

### 2. **StatCard** - Display metrics
```tsx
<StatCard
  label="Total Properties"
  value={245}
  icon={<Home className="h-6 w-6" />}
  trend={12}
  color="blue"
/>
```

### 3. **ChartCard** - Wrap charts
```tsx
<ChartCard title="Activity Overview" subtitle="Last 6 months">
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      {/* chart elements */}
    </LineChart>
  </ResponsiveContainer>
</ChartCard>
```

### 4. **DataTableCard** - Data tables
```tsx
<DataTableCard
  title="Recent Leads"
  subtitle="Latest leads"
  action={<button>View All</button>}
  footer={<p>Showing 10 of 24</p>}
>
  <table>
    <TableHeader columns={[...]} />
    <tbody>
      {data.map(item => (
        <TableRow
          key={item.id}
          data={item}
          columns={['name', 'email']}
          actions={<ActionButtons />}
        />
      ))}
    </tbody>
  </table>
</DataTableCard>
```

### 5. **SearchBar** - Search input
```tsx
const [search, setSearch] = useState("");

<SearchBar
  placeholder="Search leads..."
  value={search}
  onChange={setSearch}
  onSearch={(value) => console.log("Search:", value)}
/>
```

### 6. **FilterBar** - Filter controls
```tsx
import { FilterBar, FilterSelect } from "@/components/admin/common/FilterBar";

<FilterBar>
  <FilterSelect
    label="Status"
    value={status}
    onChange={setStatus}
    options={[
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]}
  />
  <FilterSelect
    label="Source"
    value={source}
    onChange={setSource}
    options={[
      { value: "website", label: "Website" },
      { value: "phone", label: "Phone" }
    ]}
  />
</FilterBar>
```

### 7. **Badge** - Status indicators
```tsx
<Badge
  label="Active"
  variant="success"
  size="md"
/>

{/* Variants: default, success, warning, error, info */}
```

### 8. **ActionButtons** - CRUD actions
```tsx
<ActionButtons
  onView={() => handleView(id)}
  onEdit={() => handleEdit(id)}
  onDelete={() => handleDelete(id)}
  size="sm"
/>
```

### 9. **Modal** - Dialogs
```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Lead"
  subtitle="Update lead information"
  footer={
    <>
      <button onClick={() => setIsOpen(false)}>Cancel</button>
      <button onClick={handleSave}>Save</button>
    </>
  }
>
  {/* Form content */}
</Modal>
```

### 10. **Alert** - Notifications
```tsx
<Alert
  variant="success"
  title="Success"
  message="Lead created successfully"
  onClose={() => setShowAlert(false)}
/>

{/* Variants: info, success, warning, error */}
```

### 11. **Pagination** - Page navigation
```tsx
const [page, setPage] = useState(1);

<Pagination
  currentPage={page}
  totalPages={5}
  onPageChange={setPage}
/>
```

### 12. **EmptyState** - No data
```tsx
<EmptyState
  icon={<Users className="h-12 w-12" />}
  title="No leads yet"
  description="Create your first lead to get started"
  action={<button>Create Lead</button>}
/>
```

## 🎨 Tailwind Classes Used

- **Colors**: blue, green, purple, orange, red, yellow, gray
- **Spacing**: p-4, p-6, px-6, py-4, gap-4, gap-6
- **Text**: text-sm, text-lg, font-medium, font-semibold
- **Borders**: rounded-lg, border, border-gray-200
- **Shadows**: shadow-sm
- **Grid**: grid, grid-cols-1, md:grid-cols-2, lg:grid-cols-4

## 🔄 Complete Page Example

See `page-new.tsx` for a complete dashboard implementation with:
- Stats grid
- Line and bar charts
- Data table with actions
- Responsive design

## 📱 Responsive Design

All components are mobile-first responsive:
- Grid layouts use `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Tables have `overflow-x-auto` for mobile
- Padding adjusts with `p-4 sm:p-6 md:p-8`

## 🎯 Next Steps

1. Copy `page-new.tsx` to replace your current dashboard
2. Update API endpoints to match your backend
3. Customize colors and icons as needed
4. Add more pages using the same component structure
