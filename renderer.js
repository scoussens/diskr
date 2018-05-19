// Require Dependencies
const $ = require('jquery');
const powershell = require('node-powershell');
const dt = require('datatables.net')();
const dtbs = require('datatables.net-bs4')(window, $);

const SCRIPTS = {
    GetDrives: require('path').resolve(__dirname, './scripts/Get-Drives.ps1')
}

// Testing PowerShell
$("#getDisk").click(() => {
    // Clear the Error Messages
    $('.alert-danger .message').html()
    $('.alert-danger').hide()
    let computer = $('#computerName').val() || 'localhost';
    // Create the PS Instance
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })

    // Load the gun
    ps.addCommand(SCRIPTS.GetDrives, [
        {
            ComputerName: computer
        }
    ])

    // Pull the Trigger
    ps.invoke()
        .then(output => {
            let data = JSON.parse(output);

            if (data.Error) {
                $('.alert-danger .message').html(data.Error.Message)
                $('.alert-danger').show()
                return
            }

            let columns = [];
            Object.keys(data[0]).forEach(key => columns.push({ title: key, data: key }));

            $('#output').DataTable({
                data: data,
                columns: columns,
                paging: false,
                searching: false,
                info: false,
                destroy: true  // or retrieve: true
            });
        })

})