<?php

$currentResult = 0;
$calculatorInput = [];

if($_SERVER['REQUEST_METHOD'] == "POST"){
    if(isset($_POST['input'])){
        $calculatorInput = json_decode($_POST['input']);
    }

    foreach ($_POST as $key => $value){
        switch ($key) {
            case 'equal':
                $currentResult = evaluateInput($calculatorInput);
                $calculatorInput = [];
                $calculatorInput[] = $currentResult;
                break;
            case "ce":
                array_pop($calculatorInput);
                break;
            case "c":
                $calculatorInput = [];
                $currentResult = 0;
                break;
            case "back":
                if (!empty($calculatorInput)) {
                    $lastIndex = count($calculatorInput) - 1;
                    if(is_numeric($calculatorInput[$lastIndex])){
                        array_pop($calculatorInput);
                    }
                }
                break;
            case "input":
                break;
            default:
                $calculatorInput[] = $value;
                break;
        }
    }
}
function convertInputToString($values){
    $inputString = "";
    foreach ($values as $value){
        $inputString .= $value;
    }
    return $inputString;
}

function evaluateInput($userInput){
    $formattedInput = [];
    $currentNumber = "";

    foreach ($userInput as $inputChar){
        if(is_numeric($inputChar) || $inputChar == "."){
            $currentNumber .= $inputChar;
        }else{
            if(!empty($currentNumber)){
                $formattedInput[] = $currentNumber;
                $currentNumber = "";
            }
            $formattedInput[] = $inputChar;
        }
    }

    if(!empty($currentNumber)){
        $formattedInput[] = $currentNumber;
    }

    $result = 0;
    $operation = null;

    for($i = 0; $i < count($formattedInput); $i++){
        if(is_numeric($formattedInput[$i])){
            if($operation){
                switch ($operation) {
                    case "+":
                        $result += $formattedInput[$i];
                        break;
                    case "-":
                        $result -= $formattedInput[$i];
                        break;
                    case "x":
                        $result *= $formattedInput[$i];
                        break;
                    case "/":
                        $result /= $formattedInput[$i];
                        break;
                }
                $operation = null;
            } else {
                if($result == 0){
                    $result = $formattedInput[$i];
                }
            }
        } else {
            $operation = $formattedInput[$i];
        }
    }

    return $result;
}

?>