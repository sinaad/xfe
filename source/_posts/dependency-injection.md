title: Dependency Injection
date: 2016-05-10 13:56:58
tags: [依赖注入，di，backend，java]
categories: other
author: zhenjun
---

## 什么是IoC

IoC(Inversion of Control)是近年来兴起的一种编程思想。主要是协调各组件间相互的依赖关系，同时大大提高了组件的可移植性，组件的重用机会也变得更多。在传统的实现中，由程序内部代码来控制程序之间的关系。我们经常使用new关键字来实现两对象组件间关系的组合，这种实现的方式会造成组件之间耦合（一个好的设计，不但要实现代码重用，还要将组件间关系解耦）。IoC很好的解决了该问题，它将实现组件间关系从程序内部提到外部容器来管理。也就是说由容器在运行期将组件间的某种依赖关系动态的注入到组件中。控制程序间关系的实现交给了外部的容器来完成。即常说的好莱坞原则“Don‘t call us, we’ll call you”（你不要找我，到时我会找你）。

## IOC概念图

![DI1](DI1.jpg)


- 实现IOC主要有两种方式：**依赖注入**和**依赖查找**
- 两者的区别在于，前者是被动的接收对象，而后者是主动索取响应名称的对象
- 依赖注入的基本原则是：
    - 应用组件不应该负责查找资源或者其他依赖的协作对象。
    - 配置对象的工作应该由IoC容器负责，“查找资源”的逻辑应该从应用组件的代码中抽取出来，交给IoC容器负责。

## 依赖查找(Dependency Lookup)

下面代码展示了基于JNDI实现的依赖查找机制。

```java
public class MyBusniessObject {
  private DataSource ds;
  private MyCollaborator myCollaborator;

  public MyBusnissObject() {
    Context ctx = null;
    try{
      ctx = new InitialContext();
      ds = (DataSource) ctx.lookup("java:comp/env/dataSourceName");
      myCollaborator = (MyCollaborator)
      ctx.lookup("java:comp/env/myCollaboratorName");
    }
  }
}
```



依赖查找的主要问题是，这段代码必须依赖于JNDI环境，所以它不能在应用服务器之外运行，并且如果要用别的方式取代JNDI来查找资源和协作对象，就必须把JNDI代码抽出来重构到一个策略方法中去。

## 依赖注入

在理解依赖注入之前，看如下这个问题在各种社会形态里如何解决:一个人(Java实例，调用者)需要一把斧子(Java实例，被调用者)。

### 原始社会里

几乎没有社会分工。需要斧子的人(调用者)只能自己去磨一把斧子(被调用者)。对应的情形为:程序里的调用者自己创建被调用者。

```java
public interface Axe {
    //Axe接口里有个砍的方法
    public String chop();
}

public class SteelAxe implements Axe {
    public SteelAxe() {
    }

    public String chop() {
        return "钢斧砍柴真快";
    }
}

public class StoneAxe implements Axe {
    public StoneAxe() {
    }
    // 实现Axe接口的chop方法
    public String chop() {
        return "石斧砍柴好慢";
    }
}

public interface Person {
    //Person接口里定义一个使用斧子的方法
    public void useAxe(String material);
}

public class ChinesePerson1 implements Person{
    private Axe axe;
    // 实现Person接口的useAxe方法
    public void useAxe(String material) {
        if("store".equals(material)){
            axe = new StoneAxe();
        }else if("steel".equals(material)){
            axe = new SteelAxe();
        }
        System.out.println(axe.chop());
    }
}
```

由调用者创建被调用的实例，必然要求被调用的类出现在调用者的代码里。无法实现二者之间的松耦合。
* 违反了面向接口编程的设计原则。
* 违反了开放关闭设计原则。
* 违反了依赖倒置原则。
* 违反了单一责任原则。




### 进入工业社会

出现了工厂。斧子不再由普通人完成，而在工厂里被生产出来，此时需要斧子的人(调用者)找到工厂，购买斧子，无须关心斧子的制造过程。对应程序的简单工厂设计模式。

```java
public class AxeFactory {
    private Axe axe;
    public Axe createAxe(String material){
        if("stone".equals(material)){
            axe = new StoneAxe();
        }else if("steel".equals(material)){
            axe = new SteelAxe();
        }
        return axe;
    }
}

public class ChinesePerson2 {
    private Axe axe;
    private AxeFactory factory;
    public void useAxe(String material) {
        axe = factory.createAxe(material);
        System.out.println(axe.chop());
    }
}
```

调用者无须关心被调用者具体实现过程，只需要找到符合某种标准(接口)的实例，即可使用。此时调用的代码面向接口编程，可以让调用者和被调用者解耦，这也是工厂模式大量使用的原因。但调用者需要自己定位工厂，调用者与特定工厂耦合在一起。

### 进入网络社会

需要斧子的人不需要找到工厂，坐在家里发出一个简单指令:需要斧子。斧子就自然出现在他面前。对应IOC容器的依赖注入。
依赖注入的三种实现类型：**接口注入**、 **Setter注入**和**构造器注入**。

#### 接口注入

我们经常使用的servlet容器，的到请求/响应对象实际上就是通过接口注入的。

```java
public class MyServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response){
        throws ServletException, IOException { ... } 
    }
}
```

`HttpServletRequest` 和 `HttpServletResponse` 两个接口的实例由 `Servlet Container `在运行期动态注入。
 
#### setter注入
下面采用Spring的配置文件将Person实例和Axe实例组织在一起。配置文件如下所示:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans>
    <!-- setter注入 -->
    <bean id="chinese" class="person.ChinesePerson3">
        <property name="axe">
            <ref local="stoneAxe"/>
        </property>
    </bean>
    <bean id="stoneAxe" class="axe.StoneAxe"></bean>
    <bean id ="steelAxe" class = "axe.SteelAxe"></bean> 
</beans>
```

```java

public class ChinesePerson3 implements Person { 
    private Axe axe;
    // 设值注入所需的setter方法
    public void setAxe(Axe axe) {
        this.axe = axe;
    }

    @Override
    public void useAxe(String material) {
        System.out.println(axe.chop());
    }
    
    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
        Person person = (Person)ctx.getBean("chinese");
        person.useAxe(" ");
    }
}
```

如果需要改写Axe的实现类。或者说，提供另一个实现类给Person实例使用。Person接口、Chinese类都无须改变。只需提供另一个Axe的实现，然后对配置文件进行简单的修改即可。

#### 构造器注入

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans>
    <!-- constructor注入 -->
    <bean id="chinese" class="person.ChinesePerson4">
        <constructor-arg index="0" ref="steelAxe"/>
    </bean> 
    <bean id="stoneAxe" class="axe.StoneAxe"></bean>
    <bean id ="steelAxe" class = "axe.SteelAxe"></bean> 
</beans>
```

```java
public class ChinesePerson4 implements Person {
    private Axe axe;
    public ChinesePerson4(Axe axe) {
        this.axe = axe;
    }
    @Override
    public void useAxe(String material) {
        System.out.println(axe.chop());
    }   
    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
        Person person = (Person)ctx.getBean("chinese");
        person.useAxe(" ");
    }
}
```

### 三种注入方式的对比

#### 接口注入：
接口注入模式因为历史较为悠久，在很多容器中都已经得到应用。但由于其在灵活性、易用性上不如其他两种注入模式，因而在 IOC 的专题世界内并不被看好。

#### 构造器注入：
在构造期间完成一个完整的、合法的对象。
所有依赖关系在构造函数中集中呈现。
依赖关系在构造时由容器一次性设定，组件被创建之后一直处于相对“不变”的稳定状态。
只有组件的创建者关心其内部依赖关系，对调用者而言，该依赖关系处于“黑盒”之中。

#### Setter 注入：
对于习惯了传统 javabean 开发的程序员，通过 setter 方法设定依赖关系更加直观。
如果依赖关系较为复杂，那么构造子注入模式的构造函数也会相当庞大，而此时设值注入模式则更为简洁。
如果用到了第三方类库，可能要求我们的组件提供一个默认的构造函数，此时构造子注入模式也不适用。


