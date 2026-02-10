## Python Specific Rules

### Immutability

Use dataclasses with `frozen=True` or `NamedTuple`:

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class User:
    name: str
    email: str

# Creating a new instance instead of modifying
def update_user(user: User, name: str) -> User:
    return replace(user, name=name)
```

### Error Handling

Use specific exceptions and context managers:

```python
try:
    result = risky_operation()
except ValueError as e:
    logger.error(f"Validation failed: {e}")
    raise
except Exception as e:
    logger.exception("Unexpected error")
    raise SystemError("Internal error") from e
```

### Type Hinting

ALWAYS use type hints:

```python
def process_data(data: dict[str, Any]) -> list[Result]:
    ...
```

### Testing

Use `pytest` fixtures and parametrization:

```python
@pytest.mark.parametrize("input,expected", [
    (1, 2),
    (2, 4),
])
def test_doubler(input, expected):
    assert double(input) == expected
```
