import {Scanner} from "./compiler/scanner";
import {parse} from "./compiler/parser";

function printTokens(s: string): void {
    const scan: Scanner = new Scanner(s);
    let tok;
    do {
        tok = scan.nextToken();
        console.log(tok);
    } while (tok !== undefined);
}

function printAST(s: string): void {
    console.log(`Parsing: "${s}".`);
    const ast = parse(s);
    console.log(ast);
}
printTokens("X");
printTokens("mod X Y");
printTokens("mod (X) Y");
printTokens("(mod X (Inv Y))");
printTokens("(((((((((())))))))))))))");
printTokens("mod X 1235.2345345");

printAST("X");
printAST("% X Y");
printAST("% (X) Y");
printAST("(% X (ABS y))");
printAST("(% X (ABS y))");
printAST("(% X (ABS 123.45.234))");

