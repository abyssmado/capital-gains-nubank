# Capital Gains Calculator

## Description

This application calculates capital gains based on a series of financial operations. It is designed to be a command-line tool that processes input from `stdin` and outputs results to `stdout`. The application adheres to the following principles:

- **In-Memory State Management**: The application does not rely on external databases. All state is managed in memory and reset upon initialization.

- **Decimal Precision**: All decimal values are rounded to two decimal places.

- **Error Handling**: Assumes valid JSON input and does not handle malformed data.

- **Output Format**: Outputs numbers directly without converting them to strings.

## Features

- Modular and maintainable code structure.

- Comprehensive unit and integration tests.

- Handles edge cases and extreme scenarios.

- Lightweight with minimal dependencies.

## Requirements

- Node.js (v16 or higher)

- npm (v7 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/abyssmado/capital-gains-nubank.git
   ```

2. Navigate to the project directory:

   ```bash
   cd capital-gains-nubank
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

1. Run the application:

   ```bash
   npm start < input.txt > output.txt
   ```

   Replace `input.txt` with your input file and `output.txt` with your desired output file.

2. Run tests:

   ```bash
   npm test
   ```

## Testing

The application includes:

- **Unit Tests**: Validate individual components.

- **Integration Tests**: Ensure components work together as expected.

- **Edge Case Tests**: Handle extreme and boundary scenarios.

## Examples

### Input

```json
[
  { "operation": "buy", "unit-cost": 10.0, "quantity": 100 },
  { "operation": "sell", "unit-cost": 15.0, "quantity": 50 }
]
```

### Output

```json
[
  { "tax": 0.0 },
  { "tax": 0.0 }
]
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
