// Convert numbers to Arabic numerals
function toArabicNumerals(num) {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit, 10)] || digit)
    .join("");
}

// Load employees from JSON file
function loadEmployees() {
  const spinner = document.querySelector(".spinner-border");
  spinner.style.display = "block"; // Show spinner

  fetch("employees.json")
    .then((response) => response.json())
    .then((employees) => {
      displayEmployeeSalaries(employees);
    })
    .catch((error) => {
      console.error("Error loading employees:", error);
    });
}

function displayEmployeeSalaries(employees) {
  const employeeTable = document.querySelector("tbody");
  const totalSalaryCell = document.getElementById("totalSalary");
  const totalOvertimeCell = document.getElementById("totalOvertime");
  const grandTotalCell = document.getElementById("grandTotal");
  const spinner = document.querySelector(".spinner-border");

  employeeTable.innerHTML = "";

  let totalSalary = 0;
  let totalOvertime = 0;

  employees.forEach((employee) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = employee.name;
    row.appendChild(nameCell);

    const salaryCell = document.createElement("td");
    salaryCell.textContent = `${toArabicNumerals(
      employee.salary.toFixed(2)
    )} EGP`;
    row.appendChild(salaryCell);

    const overtimeHoursCell = document.createElement("td");
    const overtimeHoursInput = document.createElement("input");
    overtimeHoursInput.type = "number";
    overtimeHoursInput.value = employee.overtimeHours;
    overtimeHoursInput.classList.add("form-control");
    overtimeHoursInput.style.width = "100px";
    overtimeHoursCell.appendChild(overtimeHoursInput);
    row.appendChild(overtimeHoursCell);

    const overtimeRateCell = document.createElement("td");
    const overtimeRateInput = document.createElement("input");
    overtimeRateInput.type = "number";
    overtimeRateInput.value = employee.overtimeRate;
    overtimeRateInput.classList.add("form-control");
    overtimeRateInput.style.width = "100px";
    overtimeRateCell.appendChild(overtimeRateInput);
    row.appendChild(overtimeRateCell);

    const overtimePay = employee.overtimeHours * employee.overtimeRate;
    const totalSalaryForEmployee = employee.salary + overtimePay;

    const totalCell = document.createElement("td");
    totalCell.textContent = `${toArabicNumerals(overtimePay.toFixed(2))} EGP`;
    row.appendChild(totalCell);

    const grandTotalCell = document.createElement("td");
    grandTotalCell.textContent = `${toArabicNumerals(
      totalSalaryForEmployee.toFixed(2)
    )} EGP`;
    row.appendChild(grandTotalCell);

    const actionsCell = document.createElement("td");
    const updateButton = document.createElement("button");
    updateButton.textContent = "تحديث";
    updateButton.classList.add("btn", "btn-warning");
    updateButton.addEventListener("click", () => {
      const newOvertimeHours = parseFloat(overtimeHoursInput.value);
      const newOvertimeRate = parseFloat(overtimeRateInput.value);
      updateEmployeeOvertime(employee.name, newOvertimeHours, newOvertimeRate);
    });
    actionsCell.appendChild(updateButton);
    row.appendChild(actionsCell);

    employeeTable.appendChild(row);

    totalSalary += employee.salary;
    totalOvertime += overtimePay;
  });

  const grandTotal = totalSalary + totalOvertime;
  totalSalaryCell.textContent = `${toArabicNumerals(
    totalSalary.toFixed(2)
  )} EGP`;
  totalOvertimeCell.textContent = `${toArabicNumerals(
    totalOvertime.toFixed(2)
  )} EGP`;
  grandTotalCell.textContent = `${toArabicNumerals(grandTotal.toFixed(2))} EGP`;

  spinner.style.display = "none"; // Hide spinner
}

function updateEmployeeOvertime(name, newOvertimeHours, newOvertimeRate) {
  fetch("employees.json")
    .then((response) => response.json())
    .then((employees) => {
      const employee = employees.find((emp) => emp.name === name);
      if (employee) {
        employee.overtimeHours = newOvertimeHours;
        employee.overtimeRate = newOvertimeRate;
        // Save the updated data to the file (this requires server-side support)
        // For now, you can just reload the employees
        displayEmployeeSalaries(employees);
      } else {
        console.error("Employee not found");
      }
    })
    .catch((error) => {
      console.error("Error updating employee:", error);
    });
}

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const validUsername = "omarzena";
  const validPassword = "omarzena";

  if (username === validUsername && password === validPassword) {
    document.querySelector(".login-form").style.display = "none";
    document.querySelector(".employee-list").style.display = "block";
    loadEmployees();
  } else {
    alert("اسم المستخدم أو كلمة المرور غير صحيحة");
  }
});

document
  .getElementById("addEmployeeForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const newEmployee = {
      name: document.getElementById("employeeName").value,
      salary: parseFloat(document.getElementById("employeeSalary").value),
      overtimeHours: parseFloat(document.getElementById("overtimeHours").value),
      overtimeRate: parseFloat(document.getElementById("overtimeRate").value),
    };

    // Adding a new employee will require server-side support to persist the changes
    // For now, you can just reload the employees
    loadEmployees();
  });
