---
layout: post
title: Simple Board Games in ReactJS
date: 2017-10-03
comments: true
image: /static/react/wuziqi.png
tags:
  - react
---

To ease into learning ReactJS, I took a shot at implementing a simple tic-tac-toe game with React. This is covered in the official [Facebook React tutorial](https://reactjs.org/tutorial/tutorial.html), but I haven't actually looked at how they did this yet. Instead, I wanted to see how far I could get on my own, and then fallback to the tutorial if I needed help. I heard that there are many different ways that React components can be organized and structured in a React project, so I wanted to see how my results compared to what the official tutorial recommends.

Here's the final result:

![png](/static/react/ttt.png)

You can play this game <a href="/static/react/tic-tac-react/tic-tac-react.html" target="_blank">here</a>

I wanted to give the game some additional features, so I let the player set the dimensions of the board to be any integer greater than 1. Here's a look at the main component called "Board" which contains most of the business logic:

```javascript
{% raw %}import React from 'react';
import { grid } from '../data/grid.js';
import { Square } from './Square';

export class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dim:3,
      grid:Array(3).fill(0).map(x=>Array(3).fill("+")),
      player:'X',
      winner:null,
      active:true,
    };
    this.handleOnClick = this.handleOnClick.bind(this);
    this.checkWins = this.checkWins.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.dims = [parseFloat(500/this.state.grid.length), parseFloat(500/this.state.grid[0].length)]
  }

  handleReset(){
    const newGrid = Array(this.state.dim).fill(0).map(x=>Array(this.state.dim).fill("+"))
    this.setState({'grid':newGrid, 'player':'X'});
  }

  checkWins(x, y){
    const g = this.state.grid

    function checkDiagonal1(){
      if (x == y){
        const result = new Set(g.map((_, i)=>g[i][i]));
        announceWin(result);
      }
    }

    function checkDiagonal2(){
      if (x+y+1 == g.length){
        const result = new Set(g.map((_, i)=>g[i][g.length-1-i]))
        announceWin(result);
      }
    }

    function checkHorizontal(x){
      const result = new Set(g[x]);
      announceWin(result);
    }

    function checkVertical(y){
      const result = new Set(g.map((x)=>x[y]));
      announceWin(result);
    }

    function announceWin(l){
      if (l.size == 1){
        if (l.has("X")){
          setTimeout(()=>{alert("X wins")}, 10);
          return;
        } else {
          setTimeout(()=>{alert("O wins")}, 10);
          return;
        }
      }
    }

    checkDiagonal1();
    checkDiagonal2();
    checkHorizontal(x);
    checkVertical(y);
  }

  handleOnClick(x, y){
    const g = this.state.grid
    if (this.state.active){
      if (g[x][y] == '+'){
        g[x][y] = this.state.player;
        this.setState({'grid':g});
        this.state.player = this.state.player == 'X' ? 'O':'X';
        this.checkWins(x, y);
    } else {
      alert('Please select an empty square!');
      }
    }
  }

  render(){
    const style = {
      margin:'auto',
      width: "auto",
      height:"auto",
      backgroundColor:'darkorange',
      color:'white',
      fontSize:"3em",
      tableLayout:'fixed',
    }
    const rows = this.state.grid.map((r, i) => {return (
      <tr key={"row_"+i}>
        {r.map((d, j) => {console.log('building'); return(
          <Square
            key={i+"_"+j}
            dims={this.dims}
            onClick={()=>{this.handleOnClick(i,j)}}
            contents={d=="+"?" ":d} />
              )
            }
          )
        }
        </tr>)
        }
      );
    return (
      <div style={{textAlign:"center"}}>
        <h1>Tic-Tac-React!</h1>
        <small>tic-tac-toe, written with <b>ReactJS</b>. Enjoy!</small>
        <p>Current Player: {this.state.player}</p>
        <table cellSpacing="0" id="table" style={style}>
          <tbody>
            {rows}
          </tbody>
        </table>
        <br />
        <button style={{margin:"auto"}} onClick={this.handleReset}>reset</button>
        <br /><br />
        <button onClick={()=>{this.state.dim==1?1:this.state.dim-=1;this.setState({dim:this.state.dim})}}>-</button>

            &nbsp;&nbsp;&nbsp;<span style={{color:'white'}}>{this.state.dim}</span>&nbsp;&nbsp;&nbsp;

        <button onClick={()=>{this.state.dim+=1;this.setState({dim:this.state.dim})}}>+</button>
        <br /><br/><br/>
      </div>
  )
  }
}
{% endraw %}
```

I had so much fun putting together this tic-tac-toe app that I decided to write another one of my favorite games called Gomoku. This game is somwhat similar to tic-tac-toe, but the objective is to connect 5 stones of the same color on a much larger board.

Here's a look at the result of my Gomoku game:

![png](/img/wuziqi.png)

You can play this game <a href="/static/react/wuziqi/wuziqi.html" target="_blank">here</a>

Here's the main component for this game with heavy commenting:

```javascript
{% raw %}//import React and Square component
import React from 'react';
import { Square } from './Square';
import { Button } from './Button';

//main board component with game logic
export class Board extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      //white goes first
      'isWhite':true,
      //this sets up an empty board
      //"+"" represenets an empty square, "b" is a black stone and "w" is a white stone
      'grid':Array(19).fill().map(x => Array(19).fill("+")),
    };
    //bind this word to helper functions
    this.handleClick = this.handleClick.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  //generate a new empty grid and set it to the grid state with setState
  handleReset(){
    let newGrid = Array(19).fill().map(x => Array(19).fill("+"));
    this.setState({'grid':newGrid});
  }

  handleClick(x, y){
    //only add a peice and check for wins if the clicked square is empty
    if (this.state.grid[x][y] === '+'){
      //we don't want to mutate state directly, so we store the reference to 'grid' in a const
      const g = this.state.grid;
      //set the grid square cooresponding to the clicked square to the color of the current player
      g[x][y] = this.state.isWhite === true ? 'w':'b';
      //set the state with the new grid data
      this.setState({'grid':g, 'isWhite':!this.state.isWhite})

      //helper function for
      function checkDir(x_, y_, color){
        //track how many squares of a given color there are in a given dirention (specified by x_ and y_)
        //for example checkDir(0,1, 'w') checks how many white stones there are in a row to the right )
        let tracked = 0;
        let _x = x;
        let _y = y;
        //stop tracking stones when the color is not equal to the specified stone or we have gone past the edge of the board
        while (g[_x] !== undefined && g[_x][_y] === color){
          //increment the number of tracked stones
          tracked += 1;
          //increment/decrement to check the next square in the specified direction
          _y += y_;
          _x += x_;
        }
        return tracked;
      }
      //sum the directions (left+right, up+down, 2 diagonals)
      const w_horizontal = checkDir(0, 1, 'w') + checkDir(0, -1, 'w') -1;
      const b_horizontal = checkDir(0, 1, 'b') + checkDir(0, -1, 'b') -1;

      const w_vertical = checkDir(1, 0, 'w') + checkDir(-1, 0, 'w') -1;
      const b_vertical = checkDir(1, 0, 'b') + checkDir(-1, 0, 'b') -1;

      const w_diag1 = checkDir(1, 1, 'w') + checkDir(-1, -1, 'w') -1;
      const b_diag1 = checkDir(1, 1, 'b') + checkDir(-1, -1, 'b') -1;

      const w_diag2 = checkDir(1, 1, 'w') + checkDir(-1, -1, 'w') -1;
      const b_diag2 = checkDir(-1, 1, 'b') + checkDir(1, -1, 'b') -1;

      //check to see if there are any sums greater than or equal to 5 and alert the players of a win
      //setTimeout is called so that the alert() function does not hold up the rendering of the board.
      if (w_horizontal >=  5 || w_vertical >=  5 || w_diag1 >=  5 || w_diag2 >=  5){
        setTimeout(()=>{alert('white wins')}, 1);
      }

      if (b_horizontal >= 5 || b_vertical >= 5 || b_diag1 >= 5 || b_diag2 >= 5){
        setTimeout(()=>{alert('black wins')}, 1);
      }
    }
  }
  render(){
    //define styles for the <table> element in the return() function below
    const style={
             textAlign: "center",
             margin:"auto",
             height: "auto",
             width:"500px",
             border:"1px solid black",
             tableLayout:'fixed',
           };
    const g = this.state.grid;
    //loop through the squares in each row and generate a new Square component,
    //passing in props to the Square component in the nested map() function
    const board = g.map((row, i) => { return (
      <tr key={"row_"+i}>
        {row.map((col, j) => {
          //set the color of the square based on state.grid
          const color_ = g[i][j] === '+' ? '#e4e4a1': g[i][j] === 'w' ? 'white':'black';
          //return Square component, passing in the following as props:
          //square color defined above in color_,
          //a value for the key which React needs (I think) and
          //a function to handle clicks with grid coordinates passed in as arguments
          return (
            <Square handleClick={()=>this.handleClick(i,j)} color={color_} key={i+"_"+j} />
              )
            }
          )
        }
      </tr>)
    });

    //returns the board with the Square Components in {board},
    //as well as a simple Button component that takes the handleReset function as a prop
    //this could be further refactored to separate the layout and styling, but it isn't that complicated so I will leave it like this
    return (
      <div style={{ textAlign:'center'}}>
      <h2><a href="https://en.wikipedia.org/wiki/Gomoku" style={{textDecoration:"none"}}>五子棋</a></h2>
      <div style={{margin: 'auto', width:"40%"}}>
      <table cellSpacing="0" style={style}>
        <tbody>
          {board}
        </tbody>
      </table>
      </div>
      <br />
      <Button onClick={this.handleReset} />
      </div>
    )
  }
}
{% endraw %}
```

And here is the square component:

```javascript
{% raw %}import React from 'react';

export class Square extends React.Component{
  render(){
    const color_ = this.props.color;
    return (
      <td
        style={{
          overflow:'hidden',
          width:'auto',
          height:'25px',
          backgroundColor:'#e4e4a1',
          color:'red',
          boarderColor: 'black',
          border:".5px solid black"
        }}
      onClick={this.props.handleClick} >
        <div
          style={{color:color_,
                  border:"1px solid",
                  backgroundColor: color_,
                  borderRadius: "50%",
                  borderColor: color_,
                  height:25}} >
        </div>
      </td>
    )
  }
}
{% endraw %}
```

So far, I love using React. These examples only scratch the surface of what you can do with the library, but even with these examples you can see how easy it is to keep track of state. By making use of the virtual DOM, React only rerenders the part of the actual DOM for which there has been a change in state.

There's more work to do on these games, but I will be putting them aside to learn more about React's lifecycle methods and how to do routing with react-router. Ultimately I'm working toward building React as the frontend to a Django Rest Framework API in some type of single page application (or not, there are actually a few different ways to combine React with Django and I hope to get into that soon!) I will also be learning more about Redux to see how complicated state can be easily managed by using React and Redux together.

Leave a comment if you have any questions or want to point out any errors I may have made in the code above. Thanks!
