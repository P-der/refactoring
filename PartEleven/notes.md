### 重构API



#### 将查询函数和修改函数分离

- 动机：如果一个函数即有返回值，又有副作用，可以进行分离
- 做法：
  - 复制整个函数，将其作为一个查询来命名
  - 从新建的查询函数中去掉所有造成副作用的语句
  - 执行静态检查
  - 查找所有调用原函数的地方。如果调用处用到了该函数的返回值，就将其改为调用新建的查询函数，并在下面马上再调用一次原函数。每次修改之后都要测试
  - 从原函数中去掉返回值
  - 测试


#### 函数参数化

- 动机：如果两个函数逻辑非常相似，只有一些字面量值不同，可以对函数进行合并
- 做法：
  - 从一组相似的函数中选择一个
  - 运用`改变函数声明`，把需要作为参数传入的字面量添加到参数列表中
  - 修改该函数所有的调用处，使其在调用时传入该字面量值
  - 测试
  - 修改函数体，令其使用新传入的参数。每使用一个参数都要测试
  - 对于其他与之相似的函数，逐一将其调用处改为调用已经参数化的函数。每次修改后都要测试


#### 移除标记参数

- 动机：如果使用标记参数对函数逻辑进行切分，会影响内部的控制流，并且并不是程序中流动的数据，可以去掉标记参数，使代码更简洁
- 做法：
  - 针对参数的每一种可能值，新建一个明确函数
  - 对于`用字面量值作为参数`的函数调用者，将其改为调用新建的明确函数


#### 保持对象完整

- 动机：如果在一个记录结构中导出几个值，然后又把这几个值一起传递给一个函数，更愿意把整个记录结构传给对象
- 做法：
  - 新建一个空函数，给它以期望中的参数列表(即传入完整对象作为参数)
  - 在新函数体内调用就函数，并把新的参数(即完整对象)映射到旧的参数列表(即来源于完整对象的各项数据)
  - 执行静态检查
  - 逐一修改旧函数的调用者，令其使用新函数，每次修改之后执行测试
  - 所有调用处都修改过来之后，使用`内联函数`把旧函数内联到新函数体内
  - 给新函数改名，从重构开始时的容易搜索的临时名字，改为使用旧函数的名字，同时修改所有调用处


#### 以查询取代参数

- 动机：如果函数可以承担查询正确的参数，那么可以在函数中查询
- 做法：
  - 如果有必要，使用`提炼函数`将参数的计算过程提炼到一个独立的函数中
  - 将函数体内引用该参数的地方改为调用新建的函数。每次修改后执行测试
  - 全部替换完成后，使用`改变函数声明`将该参数去掉


#### 以参数取代查询

- 动机：为了使目标函数不再依赖某个元素，可以把这个元素值以参数形式传递给该函数
- 做法：
  - 对执行查询操作的代码使用`提炼变量`，将其从函数体中分离出来
  - 现在函数体代码已经不再执行查询操作(而是使用前一步提炼出的变量)，对这部分代码使用`提炼函数`
  - 使用`内联变量`，消除刚才提炼出来的变量
  - 对原来的函数使用`内联函数`
  - 对新函数改名，改回原来函数的名字


#### 移除设值函数

- 动机：如果某个字段不希望在创建之后被修改，就不应该为它提供设值函数
- 做法：
  - 如果构造函数尚无法得到想要设入字段的值，就使用`改变函数声明`将这个值以参数的形式传入构造函数。在构造函数中调用设值函数，对字段设值
  - 移除所有在构造函数职位对设值函数的调用，改为使用新的构造函数。每次修改之后都要测试
  - 使用`内联函数`消去设值函数。如果可能的话，把字段声明为不可变
  - 测试


#### 以工厂函数取代构造函数

- 动机：希望根据环境或者参数信息创建不同的实例，也无法改变构造函数的名字，缺少了清晰的函数名
- 做法：
  - 新建一个工厂函数，让它调用现有的构造函数
  - 将调用构造函数的代码改为调用工厂函数
  - 每修改移除，就执行测试
  - 尽量缩小构造函数的可见范围


#### 以命令取代函数

- 动机：如果需要一个对象，可以服务于单一函数，可以获得对该函数的请求，执行该函数
- 做法：
  - 为想要包装的函数创建一个空的类，根据该函数的名字为其命名
  - 使用`搬移函数`把函数移到空的类里
  - 可以考虑给每个参数创建一个字段，并在构造函数中添加对应的参数


#### 以函数取代命令

- 动机：如果只想调用一个函数，让它完成自己的工作，那么可以考虑把命令对象变为普通函数
- 做法：
  - 运用`提炼函数`，把创建并执行命令对象的代码单独提炼到一个函数中
  - 对命令对象在执行阶段用到的函数，逐一使用`内联函数`
  - 使用`改变函数声明`，把构造函数的参数转移到执行函数
  - 对于所有的字段，在执行函数中找到引用它们的地方，并改为使用参数。每次修改后都要测试
  - 把调用构造函数和调用执行函数两步都要内联到调用方(也就是最终要替换命令对象的那个函数)
  - 测试
  - 用`移除死代码`把命令类消去