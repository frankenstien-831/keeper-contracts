pragma solidity 0.5.6;

import 'zeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol';

contract ERC20Token is DetailedERC20, ERC20 {

    using SafeMath for uint256;

    uint8 constant DECIMALS = 18;

    constructor (string memory name, string memory symbol)
        public
        DetailedERC20(name, symbol, DECIMALS) {}

    /**
     * @dev Function to mint tokens
     * @param to The address that will receive the minted tokens.
     * @param value The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.
     */
    function mint(
        address to,
        uint256 value
    )
        public
        returns (bool)
    {
        _mint(to, value);
        return true;
    }

     /**
     * @dev Burns a specific amount of tokens.
     * @param value The amount of token to be burned.
     */
    function burn(uint256 value)
        public
    {
        _burn(msg.sender, value);
    }

     /**
     * @dev Burns a specific amount of tokens from the target address
     * and decrements allowance
     * @param from address The address which you want to send tokens from
     * @param value uint256 The amount of token to be burned
     */
    function burnFrom(address from, uint256 value)
        public
    {
        _burnFrom(from, value);
    }

 }


