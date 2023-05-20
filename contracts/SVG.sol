// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "./Base64.sol";

contract SVG {

    struct Dice {
        string d1;
        string d2;
        string d3;
        string d4;
        string d5;
        string d6;
    }

    struct Hexagram {
        string h1;
        string h2;
        string h3;
        string h4;
    }

    constructor() {}


    function generateGrid(uint8[] memory solvedBoard, string memory gridType) public pure returns (string memory) {
        uint256 size;
        if (solvedBoard.length == 16) {
            size = 4;
        } else if (solvedBoard.length == 64) {
            size = 8;
        } else if (solvedBoard.length == 256) {
            size = 16;
        } else {
            revert("Invalid board size");
        }

        if (compareStrings(gridType, "squareGrid")) {
            return generateColorSquareGrid(solvedBoard, 4);
        } else if (compareStrings(gridType, "dice")) {
            return generateDiceGrid(solvedBoard, 4);
        } else if (compareStrings(gridType, "hexagrams")) {
            return generateHexagramGrid(solvedBoard, 4);
        } else {
            revert("Invalid grid type");
        }
    }


    function generateDiceGrid(uint8[] memory solvedBoard, uint256 size) internal pure returns (string memory) {

        Dice memory dice = Dice({
            d1: "<svg width=\"25\" height=\"25\"><circle cx=\"12.5\" cy=\"12.5\" r=\"2.5\" fill=\"black\"/></svg>",
            d2: "<svg width=\"25\" height=\"25\"><circle cx=\"6.25\" cy=\"6.25\" r=\"2.5\" fill=\"black\"/><circle cx=\"18.75\" cy=\"18.75\" r=\"2.5\" fill=\"black\"/></svg>",
            d3: "<svg width=\"25\" height=\"25\"><circle cx=\"6.25\" cy=\"6.25\" r=\"2.5\" fill=\"black\"/><circle cx=\"12.5\" cy=\"12.5\" r=\"2.5\" fill=\"black\"/><circle cx=\"18.75\" cy=\"18.75\" r=\"2.5\" fill=\"black\"/></svg>",
            d4: "<svg width=\"25\" height=\"25\"><circle cx=\"6.25\" cy=\"6.25\" r=\"2.5\" fill=\"black\"/><circle cx=\"18.75\" cy=\"6.25\" r=\"2.5\" fill=\"black\"/><circle cx=\"6.25\" cy=\"18.75\" r=\"2.5\" fill=\"black\"/><circle cx=\"18.75\" cy=\"18.75\" r=\"2.5\" fill=\"black\"/></svg>",
            d5: "<svg width=\"25\" height=\"25\"><circle cx=\"6.25\" cy=\"6.25\" r=\"2.5\" fill=\"black\"/><circle cx=\"18.75\" cy=\"6.25\" r=\"2.5\" fill=\"black\"/><circle cx=\"12.5\" cy=\"12.5\" r=\"2.5\" fill=\"black\"/><circle cx=\"6.25\" cy=\"18.75\" r=\"2.5\" fill=\"black\"/><circle cx=\"18.75\" cy=\"18.75\" r=\"2.5\" fill=\"black\"/></svg>",
            d6: "<svg width=\"25\" height=\"25\"><circle cx=\"6.25\" cy=\"6.25\" r=\"2.5\" fill=\"black\"/><circle cx=\"18.75\" cy=\"6.25\" r=\"2.5\" fill=\"black\"/><circle cx=\"6.25\" cy=\"12.5\" r=\"2.5\" fill=\"black\"/><circle cx=\"18.75\" cy=\"12.5\" r=\"2.5\" fill=\"black\"/><circle cx=\"6.25\" cy=\"18.75\" r=\"2.5\" fill=\"black\"/><circle cx=\"18.75\" cy=\"18.75\" r=\"2.5\" fill=\"black\"/></svg>"
        });

        string memory svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';
        
        for (uint256 i = 0; i < size; i++) {
            for (uint256 j = 0; j < size; j++) {
                
                uint256 index = i * size + j;
                string memory diceFace;

                if (solvedBoard[index] == 1){
                    diceFace = dice.d1;
                }
                else if (solvedBoard[index] == 2){
                    diceFace = dice.d2;
                }
                else if (solvedBoard[index] == 3){
                    diceFace = dice.d3;
                }
                else if (solvedBoard[index] == 4){
                    diceFace = dice.d4;
                }
                else if (solvedBoard[index] == 5){
                    diceFace = dice.d5;
                }
                else if (solvedBoard[index] == 6){
                    diceFace = dice.d6;
                }
                svg = string(abi.encodePacked(svg, '<g transform="translate(', uintToString(j * 25), ' ', uintToString(i * 25), ')">', diceFace, '</g>'));
            }
        }

        svg = string(abi.encodePacked(svg, '</svg>'));
        bytes memory svgBytes = bytes(svg);
        string memory base64Svg = Base64.encode(svgBytes);
        return base64Svg;
    }

    
    function generateHexagramGrid(uint8[] memory solvedBoard, uint256 size) internal pure returns (string memory) {
        Hexagram memory hexagram = Hexagram({
            h1: "<svg viewBox=\"0 0 25 25\" width=\"25\" height=\"25\"><line x1=\"4\" y1=\"6\" x2=\"10\" y2=\"6\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"15\" y1=\"6\" x2=\"21\" y2=\"6\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"9\" x2=\"21\" y2=\"9\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"12\" x2=\"10\" y2=\"12\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"15\" y1=\"12\" x2=\"21\" y2=\"12\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"15\" x2=\"21\" y2=\"15\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"18\" x2=\"10\" y2=\"18\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"15\" y1=\"18\" x2=\"21\" y2=\"18\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"21\" x2=\"21\" y2=\"21\" stroke=\"black\" strokeWidth=\"2\" /></svg>",
            h2: "<svg viewBox=\"0 0 25 25\" width=\"25\" height=\"25\"><line x1=\"4\" y1=\"6\" x2=\"10\" y2=\"6\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"15\" y1=\"6\" x2=\"21\" y2=\"6\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"9\" x2=\"21\" y2=\"9\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"12\" x2=\"10\" y2=\"12\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"15\" y1=\"12\" x2=\"21\" y2=\"12\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"15\" x2=\"21\" y2=\"15\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"18\" x2=\"21\" y2=\"18\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"21\" x2=\"10\" y2=\"21\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"15\" y1=\"21\" x2=\"21\" y2=\"21\" stroke=\"black\" strokeWidth=\"2\" /></svg>",
            h3: "<svg viewBox=\"0 0 25 25\" width=\"25\" height=\"25\"><line x1=\"4\" y1=\"6\" x2=\"10\" y2=\"6\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"15\" y1=\"6\" x2=\"21\" y2=\"6\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"9\" x2=\"21\" y2=\"9\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"12\" x2=\"10\" y2=\"12\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"15\" y1=\"12\" x2=\"21\" y2=\"12\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"15\" x2=\"21\" y2=\"15\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"18\" x2=\"21\" y2=\"18\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"21\" x2=\"21\" y2=\"21\" stroke=\"black\" strokeWidth=\"2\" /></svg>",
            h4: "<svg viewBox=\"0 0 25 25\" width=\"25\" height=\"25\"><line x1=\"4\" y1=\"6\" x2=\"10\" y2=\"6\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"15\" y1=\"6\" x2=\"21\" y2=\"6\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"9\" x2=\"21\" y2=\"9\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"12\" x2=\"21\" y2=\"12\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"15\" x2=\"10\" y2=\"15\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"15\" y1=\"15\" x2=\"21\" y2=\"15\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"18\" x2=\"21\" y2=\"18\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"4\" y1=\"21\" x2=\"10\" y2=\"21\" stroke=\"black\" strokeWidth=\"2\" /><line x1=\"15\" y1=\"21\" x2=\"21\" y2=\"21\" stroke=\"black\" strokeWidth=\"2\" /></svg>"
        });

        string memory svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';
        
        for (uint256 i = 0; i < size; i++) {
            for (uint256 j = 0; j < size; j++) {
                
                uint256 index = i * size + j;
                string memory hexagramType;

                if (solvedBoard[index] == 1){
                    hexagramType = hexagram.h1;
                }
                else if (solvedBoard[index] == 2){
                    hexagramType = hexagram.h2;
                }
                else if (solvedBoard[index] == 3){
                    hexagramType = hexagram.h3;
                }
                else if (solvedBoard[index] == 4){
                    hexagramType = hexagram.h4;
                }
                svg = string(abi.encodePacked(svg, '<g transform="translate(', uintToString(j * 25), ' ', uintToString(i * 25), ')">', hexagramType, '</g>'));
            }
        }

        svg = string(abi.encodePacked(svg, '</svg>'));
        bytes memory svgBytes = bytes(svg);
        string memory base64Svg = Base64.encode(svgBytes);
        return base64Svg;
    }

    function generateColorSquareGrid(uint8[] memory solvedBoard, uint256 size) internal pure returns (string memory) {
        string memory svgSquare = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">';

        for (uint256 i = 0; i < size; i++) {
            for (uint256 j = 0; j < size; j++) {
                uint256 index = i * size + j;
                uint8 key = solvedBoard[index];
                string memory color = getColorFromKey(key);
                string memory rect = string(abi.encodePacked('<rect width="25" height="25" fill="', color, '" x="', uintToString(j * 25), '" y="', uintToString(i * 25), '" />'));
                svgSquare = string(abi.encodePacked(svgSquare, rect));
            }
        }

        svgSquare = string(abi.encodePacked(svgSquare, '</svg>'));
        bytes memory svgBytes = bytes(svgSquare);
        string memory base64Svg = Base64.encode(svgBytes);
        return base64Svg;
    }


    function replaceYPos(string memory input, uint256 yPos) internal pure returns (string memory) {
        bytes memory inputBytes = bytes(input);
        bytes memory output = new bytes(inputBytes.length);

        uint256 j = 0;
        for (uint256 i = 0; i < inputBytes.length; i++) {
            if (i < inputBytes.length - 4 && inputBytes[i] == "Y" && inputBytes[i + 1] == "_" && inputBytes[i + 2] == "P" && inputBytes[i + 3] == "O" && inputBytes[i + 4] == "S") {
                uint256 tempYPos = yPos;
                uint256 length = 1;
                while (tempYPos >= 10) {
                    tempYPos /= 10;
                    length++;
                }
                for (uint256 k = 0; k < length; k++) {
                    output[j + length - k - 1] = bytes1(uint8(yPos % 10) + 48);
                    yPos /= 10;
                }
                j += length;
                i += 4;
            } else {
                output[j++] = inputBytes[i];
            }
        }

        return string(output);
    }

    function uintToString(uint256 value) public pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 tempValue = value;
        uint256 length = 0;
        while (tempValue != 0) {
            length++;
            tempValue /= 10;
        }
        bytes memory result = new bytes(length);
        while (value != 0) {
            result[--length] = bytes1(uint8(48 + value % 10));
            value /= 10;
        }
        return string(result);
    }

    function getColorFromKey(uint8 key) private pure returns(string memory) {
        if (key == 1) {
        return "#D9362A"; //bg-red-900
        } else if (key == 2) {
        return "#BE185D"; //bg-pink-700
        } else if (key == 3) {
        return "EC1818"; //bg-red-500
        } else if (key == 4) {
        return "#F4AA24"; //bg-yellow-500
        } else if (key == 5) {
        return "#F4D424"; //bg-yellow-300
        } else if (key == 6) {
        return "#F1F223"; //bg-yellow-100
        } else if (key == 7) {
        return "#A5DD0C"; //bg-green-300
        } else if (key == 8) {
        return "#37B400"; //bg-blue-300
        } else if (key == 9) {
        return "#98D0E9"; //bg-indigo-400
        }  else if (key == 10) {
        return "#3131FD"; //bg-lime-400
        } else if (key == 11) {
        return "#1D2C85"; //bg-green-500
        } else if (key == 12) {
        return "#F2F2F2"; //bg-green-400
        }else if (key == 13) {
        return "#1A1A1A"; //bg-green-200
        } else if (key == 14) {
        return "#71842F"; //bg-blue-100
        } else if (key == 15) {
        return "#90572F"; //bg-blue-900
        } else if (key == 16) {
        return "#8316C0"; //bg-blue-600
        }
else {
        revert("Invalid color key");
        }
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}
