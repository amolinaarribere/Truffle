import React from 'react';
const func = require("../../../Functions.js");

class ListOwnersComponent extends React.Component{
    render(){
      if(this.props.privateEnv){
        return(
          <div>
            <p><b>Total Private Owners :</b> {func.privateTotalOwners}</p>
            <p><b>Min Private Owners :</b> {func.privateMinOwners}</p>
            <p><b>Private Owners :</b>
              <ol>
                {func.privateOwners.map(privateOwner => (
                <li key={privateOwner}>{privateOwner}</li>
                ))}
              </ol>
            </p>
          </div>
        );
      }
      else{
        return(
          <div>
            <p><b>Total Public Owners :</b> {func.publicTotalOwners}</p>
            <p><b>Min Public Owners :</b> {func.publicMinOwners}</p>
            <p><b>Public Owners :</b>
              <ol>
                {func.publicOwners.map(publicOwner => (
                <li key={publicOwner}>{publicOwner}</li>
                ))}
              </ol>
            </p>
          </div>
        );
      }
      
    }
    
  }

export default ListOwnersComponent;