# app-scripts
Google app scripts for excel sheet automation to handle daily chores.

## standup-notes


   
A helper script to contain callback handlers to automate google forms for collecting Standup notes and creating a historical record.
This requires 3 different triggers to be set in associated form response google sheet.
1. On formSubmit handler for every time a response is recieved.
2. A trigger to create a new sheet everymonth with the name in the format APRIL-2022
3. A trigger to copy header row every day when next day time starts.

**Associated form:** https://forms.gle/RLS8SYEsFN9E4Ezz8 

**Form responses:** https://docs.google.com/spreadsheets/d/18mybxh3b5aVjoRsK6kuFFbWZJCBmJ_isK3E7WO74Sig/edit
