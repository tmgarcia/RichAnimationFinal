Function ExportWSToCSV ($excelFilePath, $excelFileName, $csvLoc)
{
    $excelFile = $excelFilePath + "\" + $excelFileName
	if(!($excelFileName.Contains(".xlsx")))
	{
		$excelFile  += ".xlsx"
	}
	
	if($csvLoc -eq "")
	{
		$csvLoc = $excelFilePath
	}
	
    $E = New-Object -ComObject Excel.Application
    $E.Visible = $false
    $E.DisplayAlerts = $false
	
    $wb = $E.Workbooks.Open($excelFile)
    foreach ($ws in $wb.Worksheets)
    {
		if($ws.Name -ne "BoardEnums")
		{
			$n = $excelFileName + "_" + $ws.Name
			$ws.SaveAs($csvLoc + "\" + $n + ".csv", 6)
		}
    }
	
    $E.Quit()
}

$folderPath = Read-Host 'Enter the folder path of the excel file'
$fileName = Read-Host 'Enter the excel file name'
$csvFolderPath = Read-Host 'Enter the folder path to where you want the csv files to be placed (leave blank if same as excel file)'

ExportWSToCSV -excelFilePath $folderPath -excelFileName $fileName -csvLoc $csvFolderPath