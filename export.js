var newLine = "\n";
var tab = "\t";

this.options = {
    receiver: "driver",
    showSelenese: 'false',
    header:
    '# -*- coding: utf-8 -*-\n' +
    'from selenium.webdriver.support.wait import WebDriverWait\n' +
    'from selenium.webdriver.common.by import By\n' +
    'from selenium.webdriver.support import expected_conditions as ec\n' +
    'import time\n' +
    '\n' +
    'def exportSelenium(self):\n' +
    '    driver = self.driver\n',
    footer:
    '\n' +
    'def is_element_present(self, how, what):\n' +
    '    try: self.driver.find_element(by=how, value=what)\n' +
    '    except NoSuchElementException as e: return False\n' +
    '    return True\n' +
    '\n' +
    'def is_alert_present(self):\n' +
    '    try: self.driver.switch_to_alert()\n' +
    '    except NoAlertPresentException as e: return False\n' +
    '    return True\n' +
    '\n' +
    'def close_alert_and_get_its_text(self):\n' +
    '    try:\n' +
    '        alert = self.driver.switch_to_alert()\n' +
    '        alert_text = alert.text\n' +
    '        if self.accept_next_alert:\n' +
    '            alert.accept()\n' +
    '        else:\n' +
    '            alert.dismiss()\n' +
    '        return alert_text\n' +
    '    finally: self.accept_next_alert = True\n' +
    '\n' +
    'if __name__ == "__main__":\n' +
    '    unittest.main()\n',
    indent:  '4',
    initialIndents: '2',
    defaultExtension: "py"
};


this.configForm =
    '<description>Header</description>' +
    '<textbox id="options_header" multiline="true" flex="1" rows="4"/>' +
    '<description>Footer</description>' +
    '<textbox id="options_footer" multiline="true" flex="1" rows="4"/>' +
    '<description>Indent</description>' +
    '<menulist id="options_indent"><menupopup>' +
    '<menuitem label="Tab" value="tab"/>' +
    '<menuitem label="1 space" value="1"/>' +
    '<menuitem label="2 spaces" value="2"/>' +
    '<menuitem label="3 spaces" value="3"/>' +
    '<menuitem label="4 spaces" value="4"/>' +
    '<menuitem label="5 spaces" value="5"/>' +
    '<menuitem label="6 spaces" value="6"/>' +
    '<menuitem label="7 spaces" value="7"/>' +
    '<menuitem label="8 spaces" value="8"/>' +
    '</menupopup></menulist>';

this.testcaseExtension = ".py";
this.suiteExtension = ".py";
this.webdriver = true;
this.name = "Python 3.x WebDriver";
this.driver = true;

/**
 * Parse source and update TestCase. Throw an exception if any error occurs.
 *
 * @param testCase TestCase to update
 * @param source The source to parse
 */
function parse(testCase, source) {
  var doc = source;
  var commands = [];
  while (doc.length > 0) {
    var line = /(.*)(\r\n|[\r\n])?/.exec(doc);
    var array = line[1].split(/,/);
    if (array.length >= 3) {
      var command = new Command();
      command.command = array[0]; command.target = array[1];
      command.value = array[2]; commands.push(command);
    }
    doc = doc.substr(line[0].length);
  }
  testCase.setCommands(commands);
}

/**
 * Format TestCase and return the source.
 *
 * @param testCase TestCase to format
 * @param name The name of the test case, if any. It may be used to embed title into the source.
 */
function format(testCase, name) {
    return formatCommands(testCase.commands);    
}

/**
 * Format an array of commands to the snippet of source.
 * Used to copy the source into the clipboard.
 *
 * @param The array of commands to sort.
 */
function formatCommands(commands) {
    var result = '';
    result += this.options['header'];

    for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        if (command.type == 'command') {
            var currentResult = '';


            if (result.indexOf("\""+ "command.target" + "\"") == -1)
            {
                currentResult = setCommand(command);
                result += tab + currentResult;
            }
        }
    }
    result += this.options['footer'];

    return result;
}
setCommand = function (command) {
    var result = tab;

    switch (command.command.toString()) {
        case 'open':
            result = "self.get('"+command.target.toString()+"')";
            break;
        case 'clickAndWait':
            result = searchContext(command.target.toString())+"\n";
            result += "wait = WebDriverWait(driver, 50)";
            break;
        case 'click':
            result = searchContext(command.target.toString())+".click()";
            break;
        case 'type':
        case 'sendKeys':
            result = searchContext(command.target.toString())+".send_keys('"+command.value+"')";
          /*
            result = waitForStart + searchContext(command.target.toString()) + waitForEnd;
            result += "this.CurrentElement.Clear();";
            result += newLine + tab;
            if (isStoredVariable(command.target)) {
                result += "this.CurrentElement.SendKeys(\"" + getStoredVariable(command.value) + "\");";
            }
            else {
                result += "this.CurrentElement.SendKeys(\"" + command.value + "\");";
            }
            */
            break;
        case 'assertTitle':
            result = "self.assertTrue(driver.title.startswith('"+ command.target.toString() +"'))";
            break; 
        case 'assertTextPresent':
        case 'verifyText':
        case 'verifyTextPresent':
        case 'waitForTextPresent':
        case 'assertText':
            result = "elt = " + searchContext(command.target.toString());
            result += "self.assertEqual(elt.text, '" + command.value + "')"
            break;
        case 'waitForElementPresent':
        case 'verifyElementPresent':
            break;
        case 'verifyElementNotPresent':
        case 'waitForElementNotPresent':
            break;
        case 'waitForTextNotPresent':
        case 'verifyTextNotPresent':
            break;
        case 'waitForText':
            break;
        case 'waitForChecked':
            break;
        case 'waitForNotChecked':
            break;
        case 'store':
            result = tab + "IJavaScriptExecutor js = (IJavaScriptExecutor) this.Driver;" + newLine;
            result += tab + 'string ' + command.value + '= ' + 'js.ExecuteScript(\"' + command.target + '\");';
            break;
        case 'storeEval':
            break;
        case 'storeValue':
            break;
        case 'storeAttribute':
            break;
        case 'gotoIf':
            break;
        case 'selectFrame':
            break;
        case 'label':
            break;
        case 'pause':
            break;
        case 'echo':
            break;
        case 'setTimeout':
            break;
        case 'select':
            break;
        default:
            result = '// The command: #####' + command.command + '##### is not supported in the current version of the exporter';
    }
    result += newLine;
    return result;
};


searchContext = function (locator) {
    if (locator.startsWith('xpath')) {
        return "driver.find_element_by_xpath('" + locator.substring('xpath='.length) + "')";
    }
    else if (locator.startsWith('//')) {
        return "driver.find_element_by_xpath('" + locator + "')";
    }
    else if (locator.startsWith('css')) {
        return "driver.find_element_by_css_selector('" + locator.substring('css='.length) + "')";
    }
    /*
    else if (locator.startsWith('link')) {

        return 'By.LinkText("' + locator.substring('link='.length) + '")';
    }
    else if (locator.startsWith('name')) {

        return 'By.Name("' + locator.substring('name='.length) + '")';
    }
    else if (locator.startsWith('tag_name')) {

        return 'By.TagName("' + locator.substring('tag_name='.length) + '")';
    }
    */
    else if (locator.startsWith('partialID')) {
        return "driver.find_element_by_xpath('" + "//*[contains(@id,'" + locator.substring('partialID='.length) + "')]" + "')";
    }
    else if (locator.startsWith('id')) {
        return "driver.find_element_by_id('" + locator.substring('id='.length) + "')";
    }
    else {
        return "driver.find_element_by_id('" + locator + "')";
    }
};

function isStoredVariable(commandValue) {

    return commandValue.substring(0, 1) == "$";
}

function getStoredVariable(commandValue) {

    return commandValue.substring(2, (commandValue.length - 1));
}

function getIfTargetElementIsPresent(commandValue) {

    return commandValue.substring(27, (commandValue.length - 2));
}

function getIfTargetElementIsNotPresent(commandValue) {

    return commandValue.substring(30, (commandValue.length - 2));
}

function getTargetAttribute(commandValue) {

    return commandValue.substring(commandValue.indexOf('@') + 1);
}

/*
 * Optional: The customizable option that can be used in format/parse functions.
 */
//options = {nameOfTheOption: 'The Default Value'}

/*
 * Optional: XUL XML String for the UI of the options dialog
 */
//configForm = '<textbox id="options_nameOfTheOption"/>'
