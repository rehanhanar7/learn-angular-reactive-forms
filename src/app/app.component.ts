import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  //NgForm groups these FormGroup

  signupForm: FormGroup; // declaration

  forbiddenUserNames: any[] = ['Rehan', 'Admin', 'admin', 'Hanar'];

  constructor() {}

  ngOnInit() {
    //initializing basic form
    this.signupForm = new FormGroup({
      userdata: new FormGroup({
        username: new FormControl(null, [
          Validators.required,
          this.forbiddenNames.bind(this)
        ]),
        email: new FormControl(
          null,
          [Validators.required, Validators.email],
          this.forbiddenEmails
        )
      }),
      // below code commmented for FormGroup apporach above
      // username: new FormControl(null, Validators.required), // null is default value
      // email: new FormControl(null, [Validators.required, Validators.email]), // we can pass more than one validators
      gender: new FormControl('male'),
      hobbies: new FormArray([])
    }); //creating form group

    /**
     * To Override Existing Form behaviour we have to import ReactiveFormsModule in app.module.ts
     * import { ReactiveFormsModule } from '@angular/forms';
     */

    console.log(this.signupForm);

    // to closely watch the form control we use this
    this.signupForm.valueChanges.subscribe(value =>
      console.log('value', value)
    );
    this.signupForm.statusChanges.subscribe(status =>
      console.log('status', status)
    );

    //set default value in form
    this.signupForm.setValue({
      userdata: {
        username: 'Rehan',
        email: 'rehan@rehan'
      },
      gender: 'male',
      hobbies: []
    });

    // set only one value
    this.signupForm.patchValue({
      userdata: {
        username: 'Max'
      }
    });

    setTimeout(() => {
      //clear the value after 5 seconds
      this.signupForm.reset({
        gender: 'male' // if we dont want to reset or clear certain values
      });
    }, 5000);
  }

  onSubmit() {
    console.log(this.signupForm);
  }

  onAddHobby() {
    const newformcontrol = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(newformcontrol);
  }

  /**
   * Below is our custom validator
   */
  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUserNames.indexOf(control.value) !== -1) {
      return { nameIsForbidden: true };
    }
    return null;
  }

  /**
   * Below is the async Validator
   */
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value == 'test@test') {
          resolve({ emailisforbidden: true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
}
