//Jayaweera W.A.H.M. Dinuka T Jayaweera
import {Page, Modal, NavController, NavParams, ViewController, Alert, ActionSheet} from 'ionic-angular';
import {DBService} from '../../service/dbservice';

@Page({
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {

    static get parameters(){
        return[ [NavController], [DBService] ];
    }

    constructor(nav, dbservice){
        this.nav = nav;
        this.dbservice = dbservice;
        this.tasks=[];

        this.viewTodo();
    }

    viewTodo(){
        this.dbservice.getTodo().then((data) => {
            this.tasks = [];
            if(data.res.rows.length > 0){
                for(var i = 0; i < data.res.rows.length; i++){
                    this.tasks.push({id: data.res.rows.item(i).id, task: data.res.rows.item(i).task, priority: data.res.rows.item(i).priority, status: data.res.rows.item(i).status});
                }
            }
        });
    }

    deleteTodo(id){
        this.nav.present(ActionSheet.create({
            title: 'Are you sure you want to delete Todo?',
            buttons:[
                {
                    text: 'Yes',
                    style: 'destructive',
                    handler:() => {
                        this.dbservice.deleteTodo(id).then(() => {
                            this.nav.present(Alert.create({
                                //title: 'Success',
                                subTitle: 'Todo removed !',
                                buttons: [{
                                    text: 'OK',
                                    handler:() => {
                                        this.viewTodo();
                                    }
                                }]
                            }));
                        });
                    }
                },{
                    text: 'Cancel',
                    style: 'cancel',
                    handler: () => {
                        console.log('cancle clicked');
                    }
                }
            ]
        }));
    }

    editTodo(id, status){
        this.dbservice.editTodo(id, status).then((data) => {
            this.nav.present(Alert.create({
                //title: 'Success',
                subTitle: 'Todo updated successfully!',
                buttons: [{
                    text: 'OK',
                    handler:() => {
                        this.viewTodo();
                    }
                }]
            }));
        });
    }

    showTodo(id){
        let modal = Modal.create(MyModal, {taskId: id});
        modal.onDismiss(data =>{
            this.viewTodo();
        })
        this.nav.present(modal);
    }
}

@Page({
    templateUrl: 'build/pages/home/modal.html'
})

class MyModal{

    static get parameters(){
        return [ [NavController], [NavParams], [ViewController], [DBService] ];
    }

    constructor(nav, params, viewCtrl, dbservice){
        this.nav = nav;
        this.dbservice = dbservice;
        this.viewCtrl = viewCtrl;
        this.tasks = [];

        this.taskid = params.get('taskId');

        if(this.taskid !== undefined){
            this.label = "Edit";
            this.dbservice.getTodo(this.taskid).then((data) => {
                this.task = data.res.rows.item(0).task;
                this.priority = data.res.rows.item(0).priority;
            });
        }else{
            this.label = "Add New ";
            this.priority = "Normal";
        }
    }

    saveTodo(){
        if(this.task === undefined){
            this.nav.present(Alert.create({
                title: 'Oooops!!',
                subTitle: 'Please enter a todo',
                buttons: ["OK"]
            }));
        }else{
            let newItem = {
                task: this.task,
                priority: this.priority
            };

            this.dbservice.saveTodo(this.taskid, newItem).then((data)=>{

                if(this.taskid === undefined){
                    var msg = "Todo added successfully!";
                }else{
                    var msg = "Todo updated successfully!";
                }
                console.log(msg);
                this.nav.present(Alert.create({
                    //title: 'Success',
                    subTitle: msg,
                    buttons: [{
                        text: 'OK',
                        handler:() =>{
                            this.close();
                        }
                    }]
                }));
            });
        }
    }

    close(){
        this.viewCtrl.dismiss();
    }
}
