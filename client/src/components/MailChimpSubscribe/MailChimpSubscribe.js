import React, { Component } from 'react';
import './MailChimpSubscribe.css';

export default class MailChimpSubscribe extends Component {
  constructor() {
    super();

    this.state = { hideForm: localStorage.getItem('hideMailChimpForm') || false };
  }

  closeForm() {
    localStorage.setItem('hideMailChimpForm', true);
    this.setState({ hideForm: true });
  }

  render() {
    return (
      <div className="MailChimpSubscribe" style={{display: this.state.hideForm ? 'none' : 'block'}}>

        <p>
          <span role="img">🎪</span> We are building tools for meetup <b>venues</b> & <b>organisers</b>.&nbsp;&nbsp;Be the first to hear about our new dashboards &raquo;
        </p>

        <div id="mc_embed_signup">
          <form action="https://herokuapp.us7.list-manage.com/subscribe/post?u=c35b89274f760a393a108106e&amp;id=1d1d6e38da" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate onSubmit={this.closeForm.bind(this)}>
            <div id="mc_embed_signup_scroll" style={{display: 'flex', justifyContent: 'center'}}>
              <div className="mc-field-group">
                <label htmlFor="mce-EMAIL" style={{display: 'none'}}>Email Address </label>
                <input placeholder="Your email address" type="email" name="EMAIL" className="required email" id="mce-EMAIL"/>
              </div>
              <div id="mce-responses" className="clear">
                <div className="response" id="mce-error-response" style={{display: 'none'}}></div>
                <div className="response" id="mce-success-response" style={{display: 'none'}}></div>
              </div>
              <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
                <input type="text" name="b_c35b89274f760a393a108106e_1d1d6e38da" tabIndex="-1" />
              </div>
              <div className="clear">
                <input type="submit" value="Save" name="subscribe" id="mc-embedded-subscribe" className="button" />
              </div>
            </div>
          </form>
        </div>
      
      </div>
    )
  }
}
