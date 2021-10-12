// useStateで状態管理を行う
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// HTTP通信を行うため↓アクシオスという。
import axios from 'axios'
import styled from 'styled-components'
// アイコンのインポート↓ チェックボックスとか
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import { AiFillEdit } from 'react-icons/ai'

// 検索窓とremove_allのボタンをラップする
const SearchAndButtton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SearchForm = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 10px;
`

// 全てを削除するボタンタグ
const RemoveAllButton = styled.button`
  width: 16%;
  height: 40px;
  background: #f54242;
  border: none;
  font-weight: 500;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
`

const TodoName = styled.span`
  font-size: 27px;
  /* is_completedがtrueの時にopacity(不透明度)を0.4にする。つまりブラックの文字を薄くする。 */
  ${({ is_completed }) => is_completed && `
    opacity: 0.4;
  `}
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 7px auto;
  padding: 10px;
  font-size: 25px;
`

const CheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  color: green;
  cursor: pointer;
`

const UncheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  cursor: pointer;
`

// 「SPAN」とは、単体では特に意味を持たないタグですが、<span>～</span>で囲った部分をインライン要素としてグループ化することができるタグです。
const EditButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`

function TodoList() {
  // useStateによりstateの管理を行う。todosを変更するためのメソッドがsetTodos。useState([])は初期値は空の配列。
  const [todos, setTodos] = useState([])
  // 検索機能で使う。searchNameを変更するためのメソッドsetSearchName
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    // todosコントローラーのindexがかえる
    axios.get('/api/v1/todos.json')
    .then(resp => {
      console.log(resp.data)
      // レスポンスのデータを渡す。
      // resp.dataは
      // def index
      // todos = Todo.order(updated_at: :desc)
      // render json: todos
      // end
      // から
      setTodos(resp.data);
    })
    .catch(e => {
      console.log(e);
    })
    // 第二引数はからの配列[]を渡してあげる。そうするとtodo.ksが描画された時にuseEffectが１度だけ走る。
  }, [])

  const removeAllTodos = () => {
    // ダイアログボックス表示
    const sure = window.confirm('Are you sure?');
    if (sure) {
      axios.delete('/api/v1/todos/destroy_all')
      .then(resp => {
        // setTodosをからの配列に更新する
        setTodos([])
      })
      .catch(e => {
        console.log(e)
      })
    }
  }

  // 引数を２つとる。valは更新しようとしているレコードそのもの。
  const updateIsCompleted = (index, val) => {
    var data = {
      id: val.id,
      name : val.name,
      // val.is_completedを反転させた値
      is_completed: !val.is_completed
    }
    axios.patch(`/api/v1/todos/${val.id}`, data)
    .then(resp => {
      // スプレット構文でtodosを展開したものを入れる
      const newTodos = [...todos]
      // newTodosの該当のindexのis_completedを変更
      newTodos[index].is_completed = resp.data.is_completed
      // setTodos引数にnewTodosとすることでtodosを更新
      setTodos(newTodos)
    })
  }

// return文
  return (
    <>
      <h1>Todo List</h1>
      <SearchAndButtton>
        <SearchForm
          type="text"
          placeholder="Search todo..."
          // inputタグの中身が変わった時にsetSearchNameが呼び出される。
          onChange={event => {
            setSearchName(event.target.value)
          }}
        />
        <RemoveAllButton onClick={removeAllTodos}>
          Remove All
        </RemoveAllButton>
      </SearchAndButtton>

      {/* todoを一覧で表示させる */}
      <div>
      {/* todosを１つ１つ取り出してvalという変数に入れている */}
        {todos.filter((val) => {
          // searchName === ""は検索窓の文字が空の時
          if(searchName === "") {
            return val
            // 検索窓の文字をtoLowerCase（小文字)にして valのnameがsearchNameを含んでいたら、valを返す。
          } else if (val.name.toLowerCase().includes(searchName.toLowerCase())) {
//             console.log(val)
//             {id: 3, name: "publishing a book", is_completed: true, created_at: "2021-04-30T15:18:40.105Z", updated_at: "2021-04-30T20:00:57.613Z"}
              // created_at: "2021-04-30T15:18:40.105Z"
              // id: 3
              // is_completed: true
              // name: "publishing a book"
              // updated_at: "2021-04-30T20:00:57.613Z"
              // __proto__: Object
            return val
          }
          // 返されたvalをmapで展開しまたvalという変数に入れている。keyは１、２、３...の数字が格納されている。
        }).map(
          (val, key) => {
//             console.log(this)
//             undefined
//             console.log(val)
//             {id: 3, name: "publishing a book", is_completed: true, created_at: "2021-04-30T15:18:40.105Z", updated_at: "2021-04-30T20:00:57.613Z"}
                // created_at: "2021-04-30T15:18:40.105Z"
                // id: 3
                // is_completed: true
                // name: "publishing a book"
                // updated_at: "2021-04-30T20:00:57.613Z"
                // __proto__: Object
            // console.log(key)
            // 0
          return (
            <Row key={key}>
              {val.is_completed ? (
                <CheckedBox>
                  <ImCheckboxChecked onClick={() => updateIsCompleted(key, val) } />
                </CheckedBox>
              ) : (
                <UncheckedBox>
                  <ImCheckboxUnchecked onClick={() => updateIsCompleted(key, val) } />
                </UncheckedBox>
              )}
              <TodoName is_completed={val.is_completed}>
                {val.name}
              </TodoName>
              <Link to={"/todos/" + val.id + "/edit"}>
                <EditButton>
                  <AiFillEdit />
                </EditButton>
              </Link>
            </Row>
          )
        })}
      </div>
    </>
  )
}

export default TodoList
