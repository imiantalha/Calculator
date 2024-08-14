<?php
    include 'calculator.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="calculator">
        <h3>Calculator</h3>
        <div class="display">
            <form method="post">
                <input type="text" name="input" value='<?php echo json_encode($calculatorInput);?>'/>
                <p><?php echo convertInputToString($calculatorInput);?></p>
                <input type="text" value="<?php echo $currentResult;?>" readonly/>
                <table>
                    <tr>
                        <td><input type="submit" name="ce" value="CE" class="operator"/></td>
                        <td><input type="submit" name="c" value="C" class="operator"/></td>
                        <td><button type="submit" name="back" value="back">&#8592;</button></td>
                        <td><button type="submit" name="divide" value="/" class="operator">&#247;</button></td>
                    </tr>
                    <tr>
                        <td><input type="submit" name="7" value="7"/></td>
                        <td><input type="submit" name="8" value="8"/></td>
                        <td><input type="submit" name="9" value="9"/></td>
                        <td><input type="submit" name="multiply" value="x" class="operator"/></td>
                    </tr>
                    <tr>
                        <td><input type="submit" name="4" value="4"/></td>
                        <td><input type="submit" name="5" value="5"/></td>
                        <td><input type="submit" name="6" value="6"/></td>
                        <td><input type="submit" name="minus" value="-" class="operator"/></td>
                    </tr>
                    <tr>
                        <td><input type="submit" name="1" value="1"/></td>
                        <td><input type="submit" name="2" value="2"/></td>
                        <td><input type="submit" name="3" value="3"/></td>
                        <td><input type="submit" name="add" value="+" class="operator"/></td>
                    </tr>
                    <tr>
                        <td><button type="submit" name="plusminus" value="plusminus">&#177;</button></td>
                        <td><input type="submit" name="zero" value="0"/></td>
                        <td><input type="submit" name="." value="."/></td>
                        <td><input type="submit" name="equal" value="=" class="operator"/></td>
                    </tr>
                </table>
            </form>
        </div>
    </div>
</body>
</html>
 