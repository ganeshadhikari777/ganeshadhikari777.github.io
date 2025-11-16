// Initialize CodeMirror editor
let editor;

// Sample Java programs
const examples = {
    helloWorld: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Welcome to the Online Java Compiler!");
    }
}`,

    variables: `public class Main {
    public static void main(String[] args) {
        // Different data types
        int number = 42;
        double decimal = 3.14159;
        char letter = 'A';
        boolean isJavaFun = true;
        String text = "Hello, Java!";

        // Print all variables
        System.out.println("Integer: " + number);
        System.out.println("Double: " + decimal);
        System.out.println("Character: " + letter);
        System.out.println("Boolean: " + isJavaFun);
        System.out.println("String: " + text);
    }
}`,

    loops: `public class Main {
    public static void main(String[] args) {
        // For loop
        System.out.println("For loop:");
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }

        // While loop
        System.out.println("\\nWhile loop:");
        int j = 1;
        while (j <= 5) {
            System.out.println("Number: " + j);
            j++;
        }

        // Enhanced for loop
        System.out.println("\\nEnhanced for loop:");
        int[] numbers = {10, 20, 30, 40, 50};
        for (int num : numbers) {
            System.out.println("Value: " + num);
        }
    }
}`,

    arrays: `public class Main {
    public static void main(String[] args) {
        // Array declaration and initialization
        int[] numbers = {5, 2, 8, 1, 9, 3};

        System.out.println("Original array:");
        printArray(numbers);

        // Find maximum
        int max = findMax(numbers);
        System.out.println("\\nMaximum value: " + max);

        // Calculate sum
        int sum = calculateSum(numbers);
        System.out.println("Sum of elements: " + sum);

        // Calculate average
        double average = (double) sum / numbers.length;
        System.out.println("Average: " + average);
    }

    static void printArray(int[] arr) {
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }

    static int findMax(int[] arr) {
        int max = arr[0];
        for (int num : arr) {
            if (num > max) {
                max = num;
            }
        }
        return max;
    }

    static int calculateSum(int[] arr) {
        int sum = 0;
        for (int num : arr) {
            sum += num;
        }
        return sum;
    }
}`,

    classes: `public class Main {
    public static void main(String[] args) {
        // Create objects
        Dog myDog = new Dog("Buddy", 3);
        Dog yourDog = new Dog("Max", 5);

        // Call methods
        myDog.bark();
        yourDog.bark();

        myDog.displayInfo();
        yourDog.displayInfo();
    }
}

class Dog {
    String name;
    int age;

    // Constructor
    Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Method
    void bark() {
        System.out.println(name + " says: Woof! Woof!");
    }

    void displayInfo() {
        System.out.println("Dog name: " + name + ", Age: " + age + " years");
    }
}`,

    inheritance: `public class Main {
    public static void main(String[] args) {
        Circle circle = new Circle("Red", 5.0);
        Rectangle rectangle = new Rectangle("Blue", 4.0, 6.0);

        circle.display();
        System.out.println("Area: " + circle.getArea());
        System.out.println();

        rectangle.display();
        System.out.println("Area: " + rectangle.getArea());
    }
}

// Parent class
class Shape {
    String color;

    Shape(String color) {
        this.color = color;
    }

    void display() {
        System.out.println("Color: " + color);
    }
}

// Child class - Circle
class Circle extends Shape {
    double radius;

    Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    double getArea() {
        return Math.PI * radius * radius;
    }
}

// Child class - Rectangle
class Rectangle extends Shape {
    double width;
    double height;

    Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }

    double getArea() {
        return width * height;
    }
}`,

    calculator: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("=== Simple Calculator ===");
        System.out.print("Enter first number: ");
        double num1 = 10.0;  // Simulated input

        System.out.print("Enter second number: ");
        double num2 = 5.0;   // Simulated input

        System.out.println("\\nResults:");
        System.out.println("Addition: " + num1 + " + " + num2 + " = " + add(num1, num2));
        System.out.println("Subtraction: " + num1 + " - " + num2 + " = " + subtract(num1, num2));
        System.out.println("Multiplication: " + num1 + " * " + num2 + " = " + multiply(num1, num2));
        System.out.println("Division: " + num1 + " / " + num2 + " = " + divide(num1, num2));
    }

    static double add(double a, double b) {
        return a + b;
    }

    static double subtract(double a, double b) {
        return a - b;
    }

    static double multiply(double a, double b) {
        return a * b;
    }

    static double divide(double a, double b) {
        if (b != 0) {
            return a / b;
        } else {
            System.out.println("Error: Division by zero!");
            return 0;
        }
    }
}`,

    fibonacci: `public class Main {
    public static void main(String[] args) {
        int n = 10;

        System.out.println("First " + n + " Fibonacci numbers:");

        // Method 1: Iterative
        System.out.println("\\nIterative approach:");
        printFibonacciIterative(n);

        // Method 2: Recursive
        System.out.println("\\n\\nRecursive approach:");
        for (int i = 0; i < n; i++) {
            System.out.print(fibonacciRecursive(i) + " ");
        }
        System.out.println();
    }

    // Iterative method
    static void printFibonacciIterative(int n) {
        int first = 0, second = 1;

        for (int i = 0; i < n; i++) {
            System.out.print(first + " ");
            int next = first + second;
            first = second;
            second = next;
        }
    }

    // Recursive method
    static int fibonacciRecursive(int n) {
        if (n <= 1) {
            return n;
        }
        return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
    }
}`
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
});

// Initialize CodeMirror editor
function initializeEditor() {
    const editorElement = document.getElementById('editor');

    editor = CodeMirror(editorElement, {
        value: examples.helloWorld,
        mode: 'text/x-java',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        indentWithTabs: false,
        lineWrapping: true,
        extraKeys: {
            'Ctrl-Enter': function() {
                runCode();
            },
            'Cmd-Enter': function() {
                runCode();
            }
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('runBtn').addEventListener('click', runCode);
    document.getElementById('clearBtn').addEventListener('click', clearEditor);
    document.getElementById('clearOutputBtn').addEventListener('click', clearOutput);
    document.getElementById('exampleSelector').addEventListener('change', loadExample);
}

// Load example code
function loadExample(e) {
    const exampleKey = e.target.value;
    if (exampleKey && examples[exampleKey]) {
        editor.setValue(examples[exampleKey]);
    }
}

// Clear editor
function clearEditor() {
    if (confirm('Are you sure you want to clear the editor?')) {
        editor.setValue('');
    }
}

// Clear output console
function clearOutput() {
    const outputElement = document.getElementById('output');
    outputElement.innerHTML = '<div class="output-placeholder">Output cleared. Run your code to see results.</div>';
}

// Run Java code
async function runCode() {
    const code = editor.getValue().trim();

    if (!code) {
        showOutput('Please write some code first!', 'error');
        return;
    }

    const outputElement = document.getElementById('output');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Show loading state
    outputElement.innerHTML = '';
    loadingIndicator.style.display = 'flex';

    try {
        // Use Piston API (free, no auth required)
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: 'java',
                version: '*',
                files: [{
                    name: 'Main.java',
                    content: code
                }]
            })
        });

        const result = await response.json();

        loadingIndicator.style.display = 'none';

        if (result.run) {
            if (result.run.output) {
                showOutput(result.run.output, 'success');
            } else if (result.run.stderr) {
                showOutput(result.run.stderr, 'error');
            } else {
                showOutput('Code executed successfully with no output.', 'info');
            }
        } else if (result.compile && result.compile.output) {
            showOutput('Compilation Error:\n' + result.compile.output, 'error');
        } else {
            showOutput('An error occurred while executing the code.', 'error');
        }

    } catch (error) {
        loadingIndicator.style.display = 'none';
        showOutput('Error: Unable to connect to the compiler service.\n' + error.message, 'error');
        console.error('Execution error:', error);
    }
}

// Display output
function showOutput(text, type = 'success') {
    const outputElement = document.getElementById('output');
    outputElement.innerHTML = '';

    const outputDiv = document.createElement('div');
    outputDiv.className = `output-${type} output-line`;
    outputDiv.textContent = text;

    outputElement.appendChild(outputDiv);

    // Add execution info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'output-info';
    infoDiv.style.marginTop = '20px';
    infoDiv.style.paddingTop = '20px';
    infoDiv.style.borderTop = '1px solid #444';
    infoDiv.textContent = `\n[Executed at ${new Date().toLocaleTimeString()}]`;
    outputElement.appendChild(infoDiv);
}

// Welcome message
console.log('%c☕ Online Java Compiler', 'font-size: 24px; color: #2a5298; font-weight: bold;');
console.log('%cWrite and execute Java code directly in your browser!', 'font-size: 14px; color: #666;');
console.log('%cKeyboard shortcut: Ctrl+Enter or Cmd+Enter to run code', 'font-size: 12px; color: #999;');
