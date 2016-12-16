  using System;
    using System.Windows.Forms;

    namespace WindowsFormsApplication1
    {
public partial class Form1 : Form
{
    public void Ref() 
    {
        lbl_Money.Text = money.ToString();   
        lbl_PerTap.Text = upgrade.ToString(); 
        lbl_Price.Text = price.ToString();  
    }

    int money = 0;            
    int upgrade = 1;          
    int price = 64;            

    public Form1() 
    {
        InitializeComponent();
        Ref(); 
    }

    private void Tap_Clicked(object sender, EventArgs e) 
    {
        money += upgrade;
        Ref(); 
    }

    private void Upgrade_Clicked(object sender, EventArgs e)
    {
        if(money >= price) 
        { //Ano
            upgrade += 1; 
            money -= price;  
            price += (price / 16); 
        }
        else
        { //NE
            MessageBox.Show("Not Enough Money!");
        }
        Ref(); 
    } 


}
