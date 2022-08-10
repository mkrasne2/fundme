//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import { StringUtils } from "./stringUtils.sol";
import './Clonefactory.sol';
import './Fundme.sol';

contract Fundfactory is CloneFactory{
  Fundme[] public fundChildrenAddresses;
  address public implementationAddress;

  event Fundcreated(address _creator, string _name, string _description, uint256 _goal, uint256 _deadline, address _fundAddress);


  constructor(address _implementationAddress) {
    implementationAddress = _implementationAddress;
  }


  function createFund(string memory _name, 
                string memory _description, 
                string memory _externalSite, 
                uint256 _deadline, 
                uint256 _fundingGoal 
                      ) external {
        Fundme newFund = Fundme(createClone(implementationAddress));
        newFund.initialize(
          _name,
          _description,
          _externalSite,
          _deadline,
          _fundingGoal,
          msg.sender
        );

        fundChildrenAddresses.push(newFund);
        emit Fundcreated(msg.sender,
                         _name,
                         _description,
                         _fundingGoal,
                         _deadline,
                         address(newFund));
  }

  function viewFundProjects() external view returns (Fundme[] memory _addresses){
    _addresses = fundChildrenAddresses;
  }
}
