# Check if the module is already installed for the current user
$moduleInstalled = Get-InstalledModule -Name PowerShell-yaml -ErrorAction SilentlyContinue

if (-not $moduleInstalled) {
    # Install the module from the PowerShell Gallery
    Install-Module -Name PowerShell-yaml -Scope CurrentUser -Force -Confirm:$false
    Write-Output "PowerShell-yaml module installed."
} else {
    Write-Output "PowerShell-yaml module is already installed."
}


# convert raw profile to readable csv file
$currentPath = Get-Location
$yamlFilePath = Join-Path -Path $currentPath -ChildPath "profilerReportConfig.yaml"
Write-Host "yaml file path is $yamlFilePath"
$yamlContent = Get-Content -Path $yamlFilePath | Out-String | ConvertFrom-Yaml
$filter = $yamlContent.assembliesFilter
Write-Host "filter is $filter"


$unityExecutablePath = Get-Command -Name "Unity.exe" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source

Write-Host "using Unity executable at $unityExecutablePath"

$dotCoverExecutablePath = Get-Command -Name "dotCover.exe" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source

Write-Host "using dotCover executable at $dotCoverExecutablePath"

$currentPath = Get-Location
$parentDirectory = Split-Path -Path $currentPath -Parent
$currentBranch = (git branch --show-current)
Write-Host "current branch is $currentBranch"
# create a folder named as the current branch if it doesn't exist
if (!(Test-Path -Path $currentBranch)) {
    New-Item -Path $currentBranch -ItemType Directory
}
Set-Location $currentBranch
# assume that parent directory is the root of the project
$commitId = (git rev-parse HEAD)
Write-Host "commit id is $commitId"
$folderName = Get-Date -Format "yyyyMMdd_HH_mm_ss"
$currentPath = Get-Location
$folderPath = Join-Path -Path $currentPath -ChildPath "$commitId-$folderName"

Write-Host "creating folder $folderPath"

New-Item -Path $folderPath -ItemType Directory

Set-Location $folderPath

Write-Host "running tests"
$currentPath = Get-Location

# playmode, filters out Unity and Cinemachine assemblies
dotCover.exe cover /TargetExecutable:$unityExecutablePath /TargetArguments="-batchmode -projectPath $parentDirectory -runTests -testPlatform playmode -testResults $currentPath\TestsResultsPlayMode.xml -profiler-enable -profiler-log-file $currentPath\playmodeProfile.raw" /Output:"./snapshot.playmode" /Filters=$filter
# editmode
dotCover.exe cover /TargetExecutable:$unityExecutablePath /TargetArguments="-batchmode -projectPath $parentDirectory -runTests -testPlatform editmode -testResults $currentPath\TestsResultsEditMode.xml -profiler-enable -profiler-log-file $currentPath\editmodeProfile.raw" /Output:"./snapshot.editmode" /Filters=$filter
dotCover.exe merge /source:"snapshot.editmode;snapshot.playmode" /output:snapshot.both
dotCover.exe report /source:snapshot.both /output:report.html /reporttype:HTML
dotCover.exe report /source:snapshot.both /output:report.json /reporttype:JSON

# generate profiler report

$yamlContent.reportAbsolutePath = "$currentPath"

$modifiedYaml = $yamlContent | ConvertTo-Yaml
Write-Host $modifiedYaml
$modifiedYaml | Set-Content -Path $yamlFilePath
Write-Host "YAML file has been modified."

# run the profiler report generator

Write-Host "running profiler report generator"
Unity.exe -batchmode -projectPath $parentDirectory -executeMethod "Editor.GetProfilerSnapshotInfo.GetProfilerSnapshot" -logFile $currentPath\profilerReport.log -quit
Write-Host "profiler report generated at $currentPath\profilerReport.csv"

Write-Host "Exiting in 3 seconds"
# exit in 3 seconds
Start-Sleep -s 3
exit
