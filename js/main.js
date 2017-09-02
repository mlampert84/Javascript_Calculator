function evaluateCalcStack() {

    var evaluationString = calcStack["entries"].join("");




    evaluationString = evaluationString.replace("%", "*0.01");
    evaluationString = evaluationString.replace("\u03C0", "3.1415926535");
    evaluationString = evaluationString.replace("\u221A", "Math.sqrt");
    evaluationString = evaluationString.replace("ln", "Math.log");
    evaluationString = evaluationString.replace("--", "+");


    return eval(evaluationString);

}


function printCalcStack() {

    var printString = "";

    for (var i = 0; i < calcStack["entries"].length; i++) {
        var currentCharSpace = (calcStack["entries"][i]).match(/^(\+|-|\/|\*)$/);
        var previousCharSpace;
        if (i > 0)
            previousCharSpace = (calcStack["entries"][i - 1]).match(/^(\+|-|\/|\*)$/);
        else {
            previousCharSpace = false;
        }

        if (currentCharSpace || previousCharSpace)
            printString += (" " + calcStack["entries"][i]);
        else {
            printString += calcStack["entries"][i];
        }

    }

    return printString;
}




function calculator(input) {

    var numberEntered = /\d/.test(input);
    var lastElement = calcStack["entries"].length-1;
    var lastInputIsNumb = /^-*((\d+)|(\d*\.\d*))$/.test(calcStack["entries"][lastElement]);
    var previousItemIsAnswer = (calcStack["entries"].length === 1) && (calcStack["pastEntries"].length !== 0)  && !(/Previous/.test(calcStack["pastEntries"]));
    var previousItemIsClosedValue = /(\u03C0)|\)|%/.test(calcStack["entries"][lastElement])

    if (numberEntered) {
        if (previousItemIsAnswer) {
            calcStack["pastEntries"] = "Previous Answer: " + calcStack["entries"][0];
            calcStack["entries"][0] = input;
        } else if (previousItemIsClosedValue) {
            calcStack["entries"].push('*', input);
        } else if (lastInputIsNumb) {
            if (calcStack["entries"].length === 0)
                calcStack["entries"].push(input);
            else
                calcStack["entries"][lastElement] += input;

        } else if (calcStack["entries"].length === 0) {
            calcStack["entries"][0] = input;
        } else {
            calcStack["entries"].push(input);
        }

    } else if (input === "allClear") {
        if (calcStack["entries"][0] === "")
            calcStack["pastEntries"] = "";

        calcStack["entries"] = [""];

    } else if (input === "back") {


        if(calcStack["entries"][lastElement].length===1)
        calcStack["entries"].pop();

       else if(calcStack["entries"][lastElement].match(/(ln)|\u221A/))
        calcStack["entries"].pop();


        else {


          calcStack["entries"][lastElement] = calcStack["entries"][lastElement].slice(0,-1);
        }

    } else if (input === "=") {

      var testParens = calcStack["entries"].join();
      for(var i = 0; i < (testParens.match(/\(/g) || []).length -
      (testParens.match(/\)/g) || []).length;i++){
        calcStack["entries"].push(")");
   }


        var solution = evaluateCalcStack();
        calcStack["entries"].push(input);
        calcStack["pastEntries"] = printCalcStack();
        calcStack["entries"] = [solution.toString()];


    } else if (input === ".") {
        var previousItemContainsDecimal = /\.|\u03C0/.test(calcStack["entries"][lastElement]);

        if (calcStack["entries"].length === 0)
            calcStack["entries"][0] = ".";
        else if (previousItemContainsDecimal) {}

        else
            calcStack["entries"].push(input);

    }

   else if(input==="("){
        if(lastInputIsNumb || previousItemIsClosedValue)
          calcStack["entries"].push("*","(");
        else {
          calcStack["entries"].push("(");
        }
   }

  else if(input===")"){
      var entireStack = calcStack["entries"].join("");
      var numbOfOpenParens = (entireStack.match(/\(/g) || []).length;
      var numbOfClosedParens = (entireStack.match(/\)/g) || []).length;

      if(calcStack["entries"][lastElement]==="(")
        calcStack["entries"].push("0",input);


      else if((lastInputIsNumb || previousItemIsClosedValue) && numbOfOpenParens>numbOfClosedParens)
       calcStack["entries"].push(input);

  }

    else if (input === "pi") {
        if (lastInputIsNumb || previousItemIsAnswer)
            calcStack["entries"].push('*', '\u03C0');
        else
            calcStack["entries"].push('\u03C0');

    }

    else if (input === "%") {
        if (lastInputIsNumb)
            calcStack["entries"].push(input);
        else
            calcStack["entries"].push("0" + input);
    }
    else if (input === ".") {

    }

    else if (input === "sqRoot") {
      if (lastInputIsNumb || previousItemIsClosedValue)
          calcStack["entries"].push('*', '\u221A(');
      else
          calcStack["entries"].push('\u221A(');
    }

    else if (input === "ln") {
      if (lastInputIsNumb || previousItemIsClosedValue)
          calcStack["entries"].push('*', 'ln(');
      else
          calcStack["entries"].push('ln(');


    }

else if(input ==="negate"){

   if(lastInputIsNumb || previousItemIsAnswer || previousItemIsClosedValue){
      if(/-/.test(calcStack["entries"][lastElement])){
       var tempVar =  calcStack["entries"][lastElement].replace("-","");
      calcStack["entries"][lastElement] = tempVar;
  }
  else if(calcStack["entries"][lastElement]==="%")
      calcStack["entries"][lastElement-1]= "-" +       calcStack["entries"][lastElement-1];

  else if(/\)/.test(calcStack["entries"][lastElement])){


    var lastElementWithOpenParen = 0;
    for(var i=0;i<lastElement;i++){
    if(/\(/.test(calcStack["entries"][i]))
       lastElementWithOpenParen = i;
     }

   if(/-/.test(calcStack["entries"][lastElementWithOpenParen]))
      calcStack["entries"][lastElementWithOpenParen] = calcStack["entries"][lastElementWithOpenParen].replace("-","");
   else
   calcStack["entries"][lastElementWithOpenParen]= "-" +     calcStack["entries"][lastElementWithOpenParen];

  }


     else{
       calcStack["entries"][lastElement] = "-" + calcStack["entries"][lastElement];
}
}


     else
     calcStack["entries"][lastElement] = "-" + calcStack["entries"][lastElement];


}


    else {
        calcStack["entries"].push(input);

    }


    $('#mainWindow').text(printCalcStack());
    $('#enteredWindow').text(calcStack["pastEntries"]);

    // console.log(calcStack["entries"]);
}


var calcStack = {
    pastEntries: "",
    entries: []
};

$('#inputZero').click(function() {
    calculator('0');
});

$('#inputOne').click(function() {
    calculator('1');
});
$('#inputTwo').click(function() {
    calculator('2');
});
$('#inputThree').click(function() {
    calculator('3');
});
$('#inputFour').click(function() {
    calculator('4');
});
$('#inputFive').click(function() {
    calculator('5');
});
$('#inputSix').click(function() {
    calculator('6');
});
$('#inputSeven').click(function() {
    calculator('7');
});
$('#inputEight').click(function() {
    calculator('8');
});
$('#inputNine').click(function() {
    calculator('9');
});

$('#inputDecimal').click(function() {
    calculator('.');
});

$('#inputEquals').click(function() {
    calculator('=');
});

$('#inputPlus').click(function() {
    calculator('+');
});
$('#inputMinus').click(function() {
    calculator('-');
});
$('#inputMultiply').click(function() {
    calculator('*');
});
$('#inputDivide').click(function() {
    calculator('/');
});
$('#inputPercent').click(function() {
    calculator('%');
});

$('#inputPi').click(function() {
    calculator('pi');
});

$('#inputSqRoot').click(function() {
    calculator('sqRoot');
});

$('#inputLn').click(function() {
    calculator('ln');
});


$('#inputNegate').click(function() {
    calculator('negate');
});

$('#inputOpenParen').click(function() {
    calculator('(');
});
$('#inputCloseParen').click(function() {
    calculator(')');
});

$('#inputAllClear').click(function() {
    calculator('allClear');
});

$('#inputBack').click(function() {
    calculator('back');
});



$(function() {
    $(window).keypress(function(keyPress) {
        var myKey = String.fromCharCode(keyPress.which);
        calculator(myKey);
    });
});
