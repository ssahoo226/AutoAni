// It will import as many folders as you want with folder name as "1" , "2" , "3" and so on.
// Then, it create  compositions with name "1", "2" , .. corresponding to the folders "1" , "2" ... respectively
// After that, it put footages from folders into the corresponding compositions as layers for 1.25 seconds each
// Then, it scale(Here 30%) and position(Upto 5 layers in a composition) them 
// Finally, put these compositons into final composition(Name = "Video") and render the final composition

// Assumptions :- 
// The project panel is empty

function scaling(composition_index,number_of_footages){
      
                for(var i = 1;i <= number_of_footages ; i++){                                                                                         // For loop for scaling the footage
                    var width_of_layer = app.project.item(composition_index).layer(i).width;
                    var percent = 100*(216/width_of_layer);
                    app.project.item(composition_index).layer(i).scale.setValue([percent,percent]);
                }    

        }

function positioning(composition_index){
            
            if(number_of_footages == 1){
                    app.project.item(composition_index).layer(1).position.setValue([360,240]);                            // For positioning one layer(footage)
                }
            
            if(number_of_footages == 2){
                    app.project.item(composition_index).layer(1).position.setValue([180,240]);                            // For positioning two layers(footages)
                    app.project.item(composition_index).layer(2).position.setValue([540,240]);
                }
            
             if(number_of_footages == 3){
                    app.project.item(composition_index).layer(1).position.setValue([144,96]);                            // For positioning three layers(footages)
                    app.project.item(composition_index).layer(2).position.setValue([576,96]);
                    app.project.item(composition_index).layer(3).position.setValue([360,384]);
                }

            if(number_of_footages == 4){
                    app.project.item(composition_index).layer(1).position.setValue([144,96]);                            // For positioning four layers(footages)
                    app.project.item(composition_index).layer(2).position.setValue([576,96]);
                    app.project.item(composition_index).layer(3).position.setValue([144,384]);
                    app.project.item(composition_index).layer(4).position.setValue([576,384]);
                }

            if(number_of_footages == 5){
                    app.project.item(composition_index).layer(1).position.setValue([225,96]);                            // For positioning five layers(footages)
                    app.project.item(composition_index).layer(2).position.setValue([495,96]);
                    app.project.item(composition_index).layer(3).position.setValue([576,240]);
                    app.project.item(composition_index).layer(4).position.setValue([360,384]);
                    app.project.item(composition_index).layer(5).position.setValue([144,240]);
                }
    
    }

var number_of_folders = prompt("How many folders you want to import","1");
var compindex = [0];
var comptime = [0];

for(var j = 1; j <= number_of_folders ;j++){
            
            var folder = Folder.selectDialog("Choose folder ");
            var myFiles = folder.getFiles();                                                                            // For importing all files(footages) of folder in ae
            var myImportOptions = new ImportOptions();
            for (var i = 0; i < myFiles.length; i++){
                myImportOptions.file = myFiles[i];
                app.project.importFile(myImportOptions);
            }
            
            var compFolder = app.project.items.addFolder(j);                                                   // For putting selected footages into a folder
            var items = app.project.selection;
            for(var i = 0;i < items.length;i++){
                    items[i].parentFolder = compFolder;
            }
            
            var number_of_footages , n;                                                                                    
            if(j == 1){
                        n = 1;
                        number_of_footages = app.project.item(1).numItems;
                        compindex.push(n + number_of_footages + 1);
                }
            else{
                        n = n + number_of_footages + 2;
                        number_of_footages = app.project.item(n).numItems;
                        compindex.push(n + number_of_footages + 1);
                }
            
            var time_of_comp = number_of_footages*1.25 ;
            app.project.items.addComp(j,720,480,0.91,time_of_comp,29.97);
            comptime.push(time_of_comp);
            
            for(var i = n+1; i <= n + number_of_footages ; i++){                                                                     // For loop for adding footages into composition
                            app.project.item(n + number_of_footages + 1).layers.add(app.project.item(i));
            }

            var onefootagetime = 1.25;
           for(var i = 1;i <=  number_of_footages ; i++){                                                                                   // For loop for setting the time interval of each footage
                    app.project.item(n + number_of_footages + 1).layer(i).startTime = (i-1)*onefootagetime;
                    app.project.item(n + number_of_footages + 1).layer(i).stretch = (onefootagetime*100)/time_of_comp;
                }
                                    
            scaling (n + number_of_footages + 1, number_of_footages);                                 // Function call for scaling composition layers
            
            positioning (n + number_of_footages + 1);                                                           // Function call for positioning of composition layes    
            
            for(var i = 1;i <= number_of_footages;i++){                                                     // To deselect layers
                    app.project.item(n).item(i).selected = false;
            }
            
    }

var number_of_comp = compindex.length - 1;

var time = 0;
for(var i = 1; i < compindex.length;i++){
            time = time + comptime[i];
    }

app.project.items.addComp("Video",720,480,0.91,time,29.97);                                                             // To create final composition "Video"
index_of_video = compindex[compindex.length - 1] +1;

for(var i = 1; i < compindex.length; i++){                                                                                      // For loop for adding compositions into final composition
            app.project.item(index_of_video).layers.add(app.project.item(compindex[i]));
    }

for(var i = number_of_comp ; i >= 1 ; i--){                                                                                   // For loop for setting the time interval of each composition
            app.project.item(index_of_video).layer(i).startTime = comptime[number_of_comp - i];
            app.project.item(index_of_video).layer(i).stretch = 100;
      }

var resultFile = new File("E:\\firstvideo.avi")                                                                     // For rendering the project
var renderQueue = app.project.renderQueue;
var render = renderQueue.items.add(app.project.item(index_of_video));
render.outputModules[1].file = resultFile;
app.project.renderQueue.render();
