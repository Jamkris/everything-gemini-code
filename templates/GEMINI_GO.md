## Go Specific Rules

### Error Handling

Check errors immediately:

```go
result, err := riskyOperation()
if err != nil {
    return nil, fmt.Errorf("operation failed: %w", err)
}
```

### Concurrency

Use channels and context for concurrency:

```go
func worker(ctx context.Context, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        select {
        case <-ctx.Done():
            return
        default:
            results <- process(j)
        }
    }
}
```

### Struct Layout

Organize structs for readability and memory efficiency:

```go
type User struct {
    ID        int64     // 8 bytes
    CreatedAt time.Time // 24 bytes
    Name      string    // 16 bytes
    Active    bool      // 1 byte
}
```

### Testing

Use table-driven tests:

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive", 1, 2, 3},
        {"negative", -1, -1, -2},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := Add(tt.a, tt.b); got != tt.want {
                t.Errorf("Add() = %v, want %v", got, tt.want)
            }
        })
    }
}
```
